'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from '../../i18n/useTranslation';

console.log('PAGE PAYMENT SUCCESS CHARGÉE');

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { t, loading, locale } = useTranslation();
  const [orderData, setOrderData] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const orderNumberGenerated = useRef(false);
  const [commandeSaved, setCommandeSaved] = useState(false);

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
    const paymentTypeParam = searchParams.get('type');
    const paymentIntentId = searchParams.get('payment_intent');

    console.log('[DEBUG] Paramètres URL:', { orderDataParam, paymentTypeParam, paymentIntentId });

    if (orderDataParam) {
      let parsedOrderData = JSON.parse(decodeURIComponent(orderDataParam));
      setOrderNumber(parsedOrderData.orderNumber || null);
      setOrderData(parsedOrderData);
    }
    if (paymentTypeParam) {
      setPaymentType(paymentTypeParam);
    }

    // Sauvegarder la commande complète UNE SEULE FOIS
    if (orderDataParam && paymentIntentId && !commandeSaved) {
      let parsedOrderData = JSON.parse(decodeURIComponent(orderDataParam));
      saveCommande(parsedOrderData, paymentIntentId);
      setCommandeSaved(true);
    } else {
      console.log('[DEBUG] saveCommande non appelée - paramètres manquants ou déjà sauvegardée:', { orderDataParam: !!orderDataParam, paymentIntentId: !!paymentIntentId, commandeSaved });
    }
  }, [searchParams, commandeSaved]);

  const saveCommande = async (orderData, paymentIntentId) => {
    console.log('[DEBUG] saveCommande appelée avec:', { orderData, paymentIntentId });
    try {
      const requestBody = {
        paymentIntentId,
        commande: orderData
      };
      console.log('[DEBUG] Corps de la requête:', requestBody);
      
      const response = await fetch('/api/save-commande', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      const result = await response.json();
      console.log('[DEBUG] Réponse API save-commande:', result);
    } catch (error) {
      console.error('Erreur sauvegarde commande:', error);
    }
  };

  const sendWhatsAppMessage = () => {
    if (!orderData) return;

    const { deliveryDate, deliveryTime, firstName, lastName, phone, sbmLots, bbmLots, notes, isHotel, selectedHotel, roomNumber, otherHotelName, otherHotelAddress, otherHotelPostalCode, otherHotelCity, otherHotelCountry, address, postalCode, city, country, boulettesSuppGlobal, total } = orderData;

    // Date de prise de commande (date actuelle)
    const now = new Date();
    const orderDate = now.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const orderTime = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Extraire le jour et mois de la date de livraison
    const deliveryDateParts = deliveryDate.split(' ');
    const day = deliveryDateParts[1];
    const month = deliveryDateParts[2];
    
    const monthNames = {
      'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
      'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
      'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
    };
    const monthNumber = monthNames[month?.toLowerCase()] || '';

    const orderNumber = orderData.orderNumber || '--';

    // Adapter les initiales selon la langue
    const sbmInitials = locale === 'es' ? 'SAM' : 'SBM';
    const bbmInitials = locale === 'es' ? 'CAM' : 'BBM';

    const sbmDetails = Array.isArray(sbmLots)
      ? sbmLots.map((lot, index) =>
          `\n  ${sbmInitials} #${index + 1}: Piment(${lot.options?.piment ? 'Oui' : 'Non'}), Oeuf(${lot.options?.oeuf ? 'Oui' : 'Non'}), Mekbouba(${lot.options?.mekbouba ? 'Oui' : 'Non'})`
        ).join('')
      : '';
    
    const bbmDetails = Array.isArray(bbmLots)
      ? bbmLots.map((lot, index) =>
          `\n  ${bbmInitials} #${index + 1}: Piment(${lot.options?.piment ? 'Oui' : 'Non'}), Oeuf(${lot.options?.oeuf ? 'Oui' : 'Non'}), Mekbouba(${lot.options?.mekbouba ? 'Oui' : 'Non'})`
        ).join('')
      : '';

    // Construire l'adresse selon le type de livraison
    let deliveryAddress = '';
    if (isHotel === 'yes') {
      if (selectedHotel === (locale === 'es' ? 'Otro' : 'Autre')) {
        deliveryAddress = `Hôtel: ${otherHotelName}\nChambre: ${roomNumber}\nAdresse: ${otherHotelAddress}, ${otherHotelPostalCode}, ${otherHotelCity}, ${otherHotelCountry}`;
      } else {
        deliveryAddress = `Hôtel: ${selectedHotel}\nChambre: ${roomNumber}`;
      }
    } else {
      deliveryAddress = `Adresse: ${address}, ${postalCode}, ${city}, ${country}`;
    }

    const sbmCount = Array.isArray(sbmLots) ? sbmLots.reduce((sum, lot) => sum + lot.qty, 0) : 0;
    const bbmCount = Array.isArray(bbmLots) ? bbmLots.reduce((sum, lot) => sum + lot.qty, 0) : 0;
    const subtotal = sbmCount * 26 + bbmCount * 26 + (boulettesSuppGlobal * 5);
    const totalItems = sbmCount + bbmCount;
    const deliveryFee = totalItems >= 6 ? 0 : 15;
    const totalPaye = total;

    const paymentInfo = paymentType === 'cash' 
      ? 'Paiement en espèces à la livraison'
      : 'Paiement CB en ligne effectué';

    const message = `\nCommande ${orderNumber}\n-----------------------------------\nCommandé le ${orderDate} à ${orderTime}\nNom: ${lastName}\nPrénom: ${firstName}\nTéléphone: ${phone}\n\nLivraison :\nDate: ${deliveryDate} à ${deliveryTime}\n${deliveryAddress}\n\nDétails de la commande :\n${sbmInitials}: ${sbmCount} x 26€${sbmDetails}\n${bbmInitials}: ${bbmCount} x 26€${bbmDetails}${boulettesSuppGlobal > 0 ? `\nBoulettes Marchi : ${boulettesSuppGlobal} x 5€` : ''}\n\nNotes: ${notes || 'Aucune'}\n-----------------------------------\nSous-total: ${subtotal}€\nLivraison: ${deliveryFee}€\nTOTAL PAYÉ: ${totalPaye}€\n\n${paymentInfo}\n`;

    const whatsappUrl = `https://wa.me/33756872352?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 -lg shadow-md">
          <h2 className="text-xl font-semibold text-red-600">Erreur</h2>
          <p className="text-gray-600">Données de commande manquantes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 -lg shadow-md text-center">
            <div className="text-4xl mb-1">
              {paymentType === 'cash' ? '✅' : '💳'}
            </div>
            
            <h1 className="text-xl font-bold text-gray-800 mb-4">
              {paymentType === 'cash' 
                ? 'Commande confirmée !' 
                : 'Paiement réussi !'
              }
            </h1>
            
            <p className="text-gray-600 mb-6">
              {paymentType === 'cash' 
                ? `Merci ${orderData?.firstName}, votre commande a été validée. Le paiement se fera en espèces à la livraison.`
                : `Merci ${orderData?.firstName}, votre commande a été payée et confirmée pour un montant de ${orderData?.total}€.`
              }
            </p>

            <div className="bg-green-50 border border-green-200 -lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                ⚠️ ENVOYEZ IMPÉRATIVEMENT CE MESSAGE POUR LANCER LA COMMANDE EN CUISINE 👨🏻‍🍳
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={sendWhatsAppMessage}
                className="block w-full bg-[#f9f7f2] text-white py-3 px-6 -lg font-semibold hover:bg-[#0038B8] transition-colors animate-pulse"
                style={{
                  animation: 'heartbeat 1.5s ease-in-out infinite'
                }}
              >
                ENVOYER SUR WHATSAPP
              </button>
            </div>

            {/* Ticket de commande */}
            <div className="mt-8 bg-gray-50 p-4 -lg text-left">
              <h3 className="font-semibold mb-2">Récapitulatif de commande</h3>
              <div className="text-sm space-y-1">
                <div><strong>Numéro:</strong> {orderNumber || '--'}</div>
                <div><strong>Nom:</strong> {orderData?.lastName} {orderData?.firstName}</div>
                <div><strong>Téléphone:</strong> {orderData?.phone}</div>
                <div><strong>Livraison:</strong> {orderData?.deliveryDate} à {orderData?.deliveryTime}</div>
                <div><strong>Total:</strong> {orderData?.total}€</div>
              </div>
            </div>

            <div className="mt-6">
              <Link 
                href={`/${locale}/reservation`}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← Retour à la réservation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 