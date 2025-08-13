'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from '../../i18n/useTranslation';

// Charger Stripe (remplacer par ta clé publique)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

const PaymentForm = ({ orderData, paymentType, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { t, loading, locale } = useTranslation();
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState(null);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [prButtonReady, setPrButtonReady] = useState(false);
  const [success, setSuccess] = useState(false);

  // Afficher un loader pendant le chargement des traductions
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin -full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Chargement des traductions...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'FR',
        currency: 'eur',
        total: {
          label: 'Total',
          amount: amount * 100,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Gérer les événements Apple Pay
      pr.on('paymentmethod', async (event) => {
        setLoadingState(true);
        setError(null);

        try {
          // Générer un numéro de commande unique
          let orderNumber = orderData.orderNumber;
          if (!orderNumber) {
            const res = await fetch('/api/generate-order-number');
            const data = await res.json();
            orderNumber = data.orderNumber;
          }
          const orderDataWithNumber = { ...orderData, orderNumber };

          // Créer l'intention de paiement
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: amount * 100,
              paymentType,
              orderData: orderDataWithNumber
            }),
          });

          const { clientSecret, error: apiError } = await response.json();

          if (apiError) {
            throw new Error(apiError);
          }

          // Confirmer le paiement Apple Pay
          const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: event.paymentMethod.id,
          });

          if (result.error) {
            event.complete('fail');
            setError(result.error.message);
          } else {
            event.complete('success');
            setSuccess(true);
            // Succès - rediriger vers confirmation
            const paymentIntentId = result.paymentIntent?.id;
            const orderDataWithTotal = { ...orderDataWithNumber, total: amount };
            console.log('[DEBUG] Redirection ApplePay avec orderData :', orderDataWithTotal);
            const successUrl = paymentType === 'cash_validation' 
              ? `/${locale}/payment-success?type=cash&orderData=${encodeURIComponent(JSON.stringify(orderDataWithTotal))}&payment_intent=${paymentIntentId}`
              : `/${locale}/payment-success?type=full&orderData=${encodeURIComponent(JSON.stringify(orderDataWithTotal))}&payment_intent=${paymentIntentId}`;
            router.push(successUrl);
          }
        } catch (err) {
          event.complete('fail');
          setError(err.message);
        } finally {
          setLoadingState(false);
        }
      });

      pr.on('cancel', () => {
        setError('Paiement annulé');
      });

      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, amount, paymentType, orderData, router, locale]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loadingState) return; // Empêche toute double soumission
    setLoadingState(true);
    setError(null);

    if (!stripe || !elements) {
      setLoadingState(false);
      return;
    }

    try {
      // 1. Générer un numéro de commande unique
      let orderNumber = orderData.orderNumber;
      if (!orderNumber) {
        const res = await fetch('/api/generate-order-number');
        const data = await res.json();
        orderNumber = data.orderNumber;
      }
      const orderDataWithNumber = { ...orderData, orderNumber };

      // 2. Créer l'intention de paiement
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convertir en centimes
          paymentType,
          orderData: orderDataWithNumber
        }),
      });

      const { clientSecret, error: apiError } = await response.json();

      if (apiError) {
        throw new Error(apiError);
      }

      // 3. Confirmer le paiement
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        // Succès - rediriger vers confirmation
        const paymentIntentId = result.paymentIntent?.id;
        const orderDataWithTotal = { ...orderDataWithNumber, total: amount };
        console.log('[DEBUG] Redirection avec orderData :', orderDataWithTotal);
        const successUrl = paymentType === 'cash_validation' 
          ? `/${locale}/payment-success?type=cash&orderData=${encodeURIComponent(JSON.stringify(orderDataWithTotal))}&payment_intent=${paymentIntentId}`
          : `/${locale}/payment-success?type=full&orderData=${encodeURIComponent(JSON.stringify(orderDataWithTotal))}&payment_intent=${paymentIntentId}`;
        router.push(successUrl);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 -lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          {paymentType === 'cash_validation' 
            ? '💰 Validation pour paiement en espèces' 
            : '💳 Paiement complet'
          }
        </h3>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            {paymentType === 'cash_validation' 
              ? 'Votre carte sera validée (0€) pour confirmer votre commande. Le paiement se fera en espèces à la livraison.'
              : `Montant à payer : ${amount}€`
            }
          </p>
        </div>

        {/* Bouton Apple Pay / Google Pay */}
        {paymentRequest && (
          <div className="mb-6">
            <div className="text-center mb-3">
              <p className="text-sm text-gray-600 mb-2">
                💳 Paiement rapide et sécurisé
              </p>
            </div>
            <PaymentRequestButtonElement
              options={{
                paymentRequest,
                style: {
                  paymentRequestButton: {
                    type: 'default',
                    theme: 'dark',
                    height: '48px',
                  },
                },
              }}
              onReady={() => setPrButtonReady(true)}
              onClick={event => {
                // Optionnel : gestion d'événements
              }}
            />
            {!prButtonReady && (
              <div className="text-gray-500 text-sm mt-2 text-center">Chargement du bouton Apple Pay / Google Pay…</div>
            )}
            <div className="text-center mt-3">
              <p className="text-xs text-gray-500">
                {paymentType === 'cash_validation' 
                  ? 'Validation gratuite pour confirmer votre commande'
                  : `Paiement sécurisé de ${amount}€`
                }
              </p>
            </div>
          </div>
        )}

        {/* Séparateur si Apple Pay est disponible */}
        {paymentRequest && (
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>
        )}

        <div className="border border-gray-300 -lg p-4 mb-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3  mb-4">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loadingState}
          className={`w-full py-3 px-4 -lg font-semibold text-white transition-colors ${
            loadingState 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#f9f7f2] hover:bg-[#0038B8]'
          }`}
        >
          {loadingState ? 'Traitement...' : 'Confirmer le paiement'}
        </button>
      </div>
    </form>
  );
};

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const { t, loading, locale } = useTranslation();
  const [orderData, setOrderData] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
  const [amount, setAmount] = useState(0);

  // Afficher un loader pendant le chargement des traductions
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin -full h-32 w-32 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Chargement des traductions...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const orderDataParam = searchParams.get('orderData');
    const paymentTypeParam = searchParams.get('paymentType');
    const amountParam = searchParams.get('amount');

    if (orderDataParam && paymentTypeParam && amountParam) {
      try {
        setOrderData(JSON.parse(decodeURIComponent(orderDataParam)));
        setPaymentType(paymentTypeParam);
        setAmount(parseFloat(amountParam));
      } catch (error) {
        console.error('Erreur lors du parsing des données de commande:', error);
      }
    }
  }, [searchParams]);

  if (!orderData || !paymentType || amount === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Erreur</h1>
          <p className="text-gray-600">Données de commande manquantes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Paiement</h1>
          <p className="text-gray-600">Finalisez votre commande</p>
        </div>
        
        <Elements stripe={stripePromise}>
          <PaymentForm 
            orderData={orderData} 
            paymentType={paymentType} 
            amount={amount} 
          />
        </Elements>
      </div>
    </div>
  );
} 