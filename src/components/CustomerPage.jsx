import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  User, 
  ShoppingBag, 
  Sprout, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  Clock, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  ArrowRight, 
  Check, 
  LogOut, 
  Sparkles,
  ArrowLeft,
  Building2,
  Truck,
  DollarSign,
  AlertCircle,
  Calendar,
  Scale,
  FileText,
  QrCode,
  Lock,
  PackageCheck,
  FlaskConical,
  Thermometer,
  RotateCcw,
  Download,
  Headphones,
  CheckCheck,
  RefreshCw,
  Activity,
  PhoneCall,
  Navigation,
  Eye,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { dbFetchProducts, dbFetchZones, dbCreateOrder } from '../lib/supabaseClient';

// Fallback initial products from regional pilot if Supabase is temporarily unreachable
const FALLBACK_PRODUCTS = [
  {
    id: 'PROD-TOMATO',
    name: 'Hybrid Vine Tomato (S-12)',
    category: 'Tomato',
    price_per_kg: 28,
    market_price_per_kg: 38,
    unit: 'kg',
    stock_kg: 350,
    farmer_name: 'Ramesh Varma',
    village: 'Kasimkota, Anakapalli',
    trust_tier: 'Tier A+ (98.4%)',
    rating: 4.9,
    e_crop_verified: true,
    harvest_time: 'Harvested today 5:30 AM'
  },
  {
    id: 'PROD-SPINACH',
    name: 'Organic Fresh Palak (Spinach)',
    category: 'Leafy Greens',
    price_per_kg: 22,
    market_price_per_kg: 30,
    unit: 'bunch',
    stock_kg: 180,
    farmer_name: 'Lakshmi Kameswari',
    village: 'Vepagunta, Pendurthi',
    trust_tier: 'Tier A (94.2%)',
    rating: 4.8,
    e_crop_verified: true,
    harvest_time: 'Harvested today 6:00 AM'
  },
  {
    id: 'PROD-OKRA',
    name: 'Tender Green Bhendi (Ladyfinger)',
    category: 'Okra',
    price_per_kg: 34,
    market_price_per_kg: 45,
    unit: 'kg',
    stock_kg: 240,
    farmer_name: 'Appala Raju',
    village: 'Padmanabham, Bheemili',
    trust_tier: 'Tier B+ (91.0%)',
    rating: 4.6,
    e_crop_verified: true,
    harvest_time: 'Harvested today 6:15 AM'
  },
  {
    id: 'PROD-BRINJAL',
    name: 'Purple Round Brinjal (Vankaya)',
    category: 'Brinjal',
    price_per_kg: 26,
    market_price_per_kg: 36,
    unit: 'kg',
    stock_kg: 200,
    farmer_name: 'Suresh Maddala',
    village: 'Govada, Chodavaram',
    trust_tier: 'Tier A+ (97.5%)',
    rating: 4.9,
    e_crop_verified: true,
    harvest_time: 'Harvested today 5:45 AM'
  },
  {
    id: 'PROD-CHILI',
    name: 'Spicy G4 Green Chilies',
    category: 'Chili',
    price_per_kg: 42,
    market_price_per_kg: 58,
    unit: 'kg',
    stock_kg: 120,
    farmer_name: 'Venkat Rao',
    village: 'Sabbavaram Valley',
    trust_tier: 'Tier B (88.0%)',
    rating: 4.4,
    e_crop_verified: true,
    harvest_time: 'Harvested today 5:00 AM'
  },
  {
    id: 'PROD-ONION',
    name: 'Fresh Red Nasik Onions',
    category: 'Onion',
    price_per_kg: 32,
    market_price_per_kg: 42,
    unit: 'kg',
    stock_kg: 400,
    farmer_name: 'Ramesh Varma',
    village: 'Kasimkota, Anakapalli',
    trust_tier: 'Tier A+ (98.4%)',
    rating: 4.9,
    e_crop_verified: true,
    harvest_time: 'Cured harvest batch'
  },
  {
    id: 'PROD-POTATO',
    name: 'Native Hill Potatoes',
    category: 'Potato',
    price_per_kg: 25,
    market_price_per_kg: 34,
    unit: 'kg',
    stock_kg: 450,
    farmer_name: 'Suresh Maddala',
    village: 'Govada, Chodavaram',
    trust_tier: 'Tier A+ (97.5%)',
    rating: 4.9,
    e_crop_verified: true,
    harvest_time: 'Sorted grade-A tubers'
  },
  {
    id: 'PROD-CORIANDER',
    name: 'Fresh Coriander (Kothimeera)',
    category: 'Leafy Greens',
    price_per_kg: 15,
    market_price_per_kg: 22,
    unit: 'bunch',
    stock_kg: 150,
    farmer_name: 'Lakshmi Kameswari',
    village: 'Vepagunta, Pendurthi',
    trust_tier: 'Tier A (94.2%)',
    rating: 4.8,
    e_crop_verified: true,
    harvest_time: 'Harvested today 6:30 AM'
  },
  {
    id: 'PROD-CARROT',
    name: 'Sweet Native Crunchy Carrots',
    category: 'Root Vegetables',
    price_per_kg: 38,
    market_price_per_kg: 52,
    unit: 'kg',
    stock_kg: 210,
    farmer_name: 'Appala Raju',
    village: 'Padmanabham, Bheemili',
    trust_tier: 'Tier B+ (91.0%)',
    rating: 4.6,
    e_crop_verified: true,
    harvest_time: 'Harvested today 5:15 AM'
  },
  {
    id: 'PROD-CAULIFLOWER',
    name: 'Crisp White Cauliflower',
    category: 'Cruciferous',
    price_per_kg: 35,
    market_price_per_kg: 48,
    unit: 'head',
    stock_kg: 160,
    farmer_name: 'Venkat Rao',
    village: 'Sabbavaram Valley',
    trust_tier: 'Tier B (88.0%)',
    rating: 4.4,
    e_crop_verified: true,
    harvest_time: 'Harvested today 6:00 AM'
  }
];

export default function CustomerPage({ currentUser, onSignOut, onOpenAuth, onBackToHome }) {
  // Mode: 'retail' (household fresh market) | 'bulk' (50kg+ institutional forward requisitions) | 'tracking' (live cold-chain order tracking) | 'services'
  const [marketMode, setMarketMode] = useState(() => {
    if (window.location.hash === '#services') return 'services';
    if (window.location.hash === '#tracking') return 'tracking';
    return (window.location.hash === '#bulk' || window.location.hash === '#anchor') ? 'bulk' : 'retail';
  });

  // Sync marketMode on hashchange (e.g., from AI Assistant deep-links)
  useEffect(() => {
    const handleCustomerHash = () => {
      const h = window.location.hash;
      if (h === '#services') setMarketMode('services');
      else if (h === '#tracking') setMarketMode('tracking');
      else if (h === '#bulk' || h === '#anchor') setMarketMode('bulk');
      else if (h === '#customer' || h === '#market' || h === '#products') setMarketMode('retail');
    };
    window.addEventListener('hashchange', handleCustomerHash);
    return () => window.removeEventListener('hashchange', handleCustomerHash);
  }, []);

  // =========================================================================
  // 1. RETAIL CUSTOMER STATE
  // =========================================================================
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState('zone-mvp');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState({});
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);

  // =========================================================================
  // 1B. CUSTOMER SERVICES & QUALITY ASSURANCE STATE
  // =========================================================================
  const [serviceToast, setServiceToast] = useState('');
  const [activeReportModal, setActiveReportModal] = useState(null);
  const [activeSubscriptionModal, setActiveSubscriptionModal] = useState(false);
  const [activeClaimModal, setActiveClaimModal] = useState(false);
  const [activeCrateModal, setActiveCrateModal] = useState(false);
  const [activeContractDeskModal, setActiveContractDeskModal] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState('biweekly-family'); // 'weekly-single' | 'biweekly-family' | 'institutional'
  const [userSubscriptions, setUserSubscriptions] = useState([
    {
      id: 'SUB-FD-101',
      title: 'Family Fresh Farm Basket (7kg Assorted)',
      schedule: 'Every Tuesday & Friday Morning (06:30 AM)',
      hub: 'MVP Colony Cluster Hub',
      status: 'Active Subscription'
    }
  ]);

  // =========================================================================
  // 2. BULK ORDER STATE (Integrated from BulkCustomerPage)
  // =========================================================================
  const [bulkActiveTab, setBulkActiveTab] = useState('offers'); // 'offers' | 'requisition' | 'escrow' | 'logistics'
  const [reqCrop, setReqCrop] = useState('Hybrid Tomato (Grade A)');
  const [reqQty, setReqQty] = useState(300);
  const [reqGrade, setReqGrade] = useState('Grade A (Table-Ready Uniform)');
  const [deliverySlot, setDeliverySlot] = useState('Tomorrow 06:30 AM (Morning Kitchen Shift)');
  const [targetCeilingPrice, setTargetCeilingPrice] = useState(30);
  const [requisitionSubmitted, setRequisitionSubmitted] = useState(false);

  // Matched Farmer Offers with Countdown Timers
  const [matchedOffers, setMatchedOffers] = useState([
    {
      offerId: 'OFFER-FD-501',
      farmerName: 'Ramesh Varma',
      cluster: 'Kasimkota Agro-Hub (Anakapalli)',
      crop: 'Hybrid Tomato (S-12)',
      offeredQtyKg: 300,
      collarPrice: 28,
      marketSpotPrice: 38,
      matchScore: 98,
      distanceKm: 22,
      timeLimitMinutes: 114,
      trustTier: 'Tier A+ (98.4%)',
      eCropVerified: true,
      status: 'pending'
    },
    {
      offerId: 'OFFER-FD-502',
      farmerName: 'Suresh Maddala',
      cluster: 'Govada Cluster (Chodavaram)',
      crop: 'Fresh Hill Potatoes & Onions',
      offeredQtyKg: 500,
      collarPrice: 26,
      marketSpotPrice: 35,
      matchScore: 94,
      distanceKm: 28,
      timeLimitMinutes: 165,
      trustTier: 'Tier A (96.2%)',
      eCropVerified: true,
      status: 'pending'
    }
  ]);

  // Active Locked Orders & UPI Escrow Ledger
  const [activeOrders, setActiveOrders] = useState([
    {
      orderId: 'BLK-ORD-4401',
      farmerName: 'Lakshmi Kameswari',
      cluster: 'Pendurthi Farm Valley',
      crop: 'Fresh Palak & Green Leafy Bunches',
      quantityKg: 150,
      agreedPrice: 22,
      totalAmount: 3300,
      escrowStatus: 'Locked in UPI Escrow',
      scheduledDelivery: 'Today 06:15 AM',
      fulfillmentStatus: 'In Transit via 3PL'
    },
    {
      orderId: 'BLK-ORD-4392',
      farmerName: 'Venkat Rao',
      cluster: 'Sabbavaram Valley',
      crop: 'Spicy G4 Green Chilies',
      quantityKg: 80,
      agreedPrice: 42,
      totalAmount: 3360,
      escrowStatus: 'Released upon Dock Inspection',
      scheduledDelivery: 'Yesterday',
      fulfillmentStatus: 'Delivered & Accepted'
    }
  ]);

  // Morning 3PL Logistics & Tamper-Proof QR Bags
  const [dispatches, setDispatches] = useState([
    {
      dispatchId: 'DISP-3PL-101',
      driver: 'K. Prasad (Porter 3PL AP31TE9910)',
      crates: 12,
      totalWeightKg: 300.0,
      departureTime: '05:30 AM',
      estArrival: '06:20 AM',
      tamperSealsVerified: true,
      status: 'Docked at Kitchen Bay #2'
    }
  ]);

  // =========================================================================
  // 1C. CUSTOMER ORDER TRACKING STATE
  // =========================================================================
  const [trackingFilter, setTrackingFilter] = useState('all'); // 'all' | 'retail' | 'bulk'
  const [trackingSearchQuery, setTrackingSearchQuery] = useState('');
  const [activeOtpModalOrder, setActiveOtpModalOrder] = useState(null);
  const [activeTelemetryOrder, setActiveTelemetryOrder] = useState(null);
  const [trackedOrders, setTrackedOrders] = useState([
    {
      orderId: 'ORD-8941',
      type: 'retail',
      placedAt: 'Today 05:40 AM',
      items: [
        { name: 'Hybrid Vine Tomato (S-12)', qty: '2 kg', price: 56 },
        { name: 'Organic Fresh Palak (Spinach)', qty: '1 bunch', price: 22 },
        { name: 'Purple Round Brinjal (Vankaya)', qty: '1.5 kg', price: 39 }
      ],
      totalAmount: 117,
      farmerName: 'Ramesh Varma',
      farmerVillage: 'Kasimkota, Anakapalli',
      farmerTier: 'Tier A+ (98.4%)',
      hubName: 'MVP Colony Kirana Cluster Hub #1',
      hubAddress: 'Shop #12, Shivaji Park Road, Sector 3, MVP Colony',
      hubPhone: '+91 891 255-4411',
      pickupSlot: 'Today 07:00 AM - 10:00 AM',
      pickupPin: 'FD-4821',
      status: 'Ready for Pickup at Hub',
      carrier: 'Porter Electric Reefer Van',
      vehicleNumber: 'AP-31-TE-1042',
      transitTemp: '9.6°C (Nominal 8-12°C)',
      currentStep: 5,
      steps: [
        { title: 'Sunrise Harvest at Kasimkota Field', time: '05:30 AM', done: true },
        { title: 'Digital QR Bagging & Gross Weight Sealed', time: '05:45 AM', done: true },
        { title: '3PL Solar Reefer Farmgate Pickup', time: '06:00 AM', done: true },
        { title: 'Cold-Chain Line-Haul Transit (9.6°C Active)', time: '06:20 AM', done: true },
        { title: 'Neighborhood Kirana Hub Intake & Staged in Bin #4', time: '06:40 AM', done: true, active: true },
        { title: 'Customer Dual-OTP Handshake & Escrow Release', time: 'Ready for Pickup', done: false }
      ]
    },
    {
      orderId: 'BLK-ORD-4401',
      type: 'bulk',
      placedAt: 'Yesterday 04:30 PM (Forward Requisition)',
      items: [
        { name: 'Hybrid Tomato (Grade A)', qty: '100 kg (4 Crates)', price: 2800 }
      ],
      totalAmount: 2800,
      farmerName: 'Suresh Maddala',
      farmerVillage: 'Govada, Chodavaram',
      farmerTier: 'Tier A+ (97.5%)',
      hubName: 'Novotel Varun Beach Kitchen Bay #2',
      hubAddress: 'Beach Road, Maharanipeta, Visakhapatnam',
      hubPhone: '+91 891 282-2222',
      pickupSlot: 'Today 06:45 AM (Morning Shift)',
      pickupPin: 'DOCK-9914',
      status: 'In Transit via 3PL Reefer',
      carrier: 'Porter Electric Reefer Van',
      driverName: 'Suresh Maddala (+91 98480 33441)',
      vehicleNumber: 'AP-31-TV-8821',
      transitTemp: '10.2°C (Optimal Chill)',
      currentStep: 4,
      estArrival: 'In 18 mins (06:45 AM)',
      steps: [
        { title: 'Forward Requisition Matched & Escrow Funded', time: 'Yesterday 05:00 PM', done: true },
        { title: 'Dawn Harvest & Calibrated Crate Weighing', time: '05:15 AM', done: true },
        { title: 'Farmgate 3PL Reefer Loading & Tamper Tagging', time: '05:45 AM', done: true },
        { title: 'Cold-Chain Line-Haul Transit (Anandapuram Corridor)', time: '06:15 AM', done: true, active: true },
        { title: 'Kitchen Receiving Bay Weighbridge & Tamper Scan', time: 'Est. 06:45 AM', done: false },
        { title: 'Instant UPI Escrow Payout Released to Farmer', time: 'Pending Scan', done: false }
      ]
    }
  ]);

  // Load products and zones from Supabase
  useEffect(() => {
    async function loadData() {
      const liveProducts = await dbFetchProducts();
      if (liveProducts && liveProducts.length > 0) {
        setProducts(liveProducts);
      }
      const liveZones = await dbFetchZones();
      if (liveZones && liveZones.length > 0) {
        setZones(liveZones);
      }
    }
    loadData();
  }, []);

  // Vegetable dropdown options
  const VEGETABLE_DROPDOWN_OPTIONS = [
    { label: 'All Vegetables', value: 'All' },
    { label: '🍅 Tomato (Tamata)', value: 'Tomato' },
    { label: '🥬 Spinach (Palak)', value: 'Spinach' },
    { label: '🥒 Okra / Bhendi', value: 'Okra' },
    { label: '🍆 Brinjal (Vankaya)', value: 'Brinjal' },
    { label: '🌶️ Green Chili (Mirchi)', value: 'Chili' },
    { label: '🧅 Red Onion (Ulli)', value: 'Onion' },
    { label: '🥔 Native Potato (Alu)', value: 'Potato' },
    { label: '🌿 Coriander (Kothimeera)', value: 'Coriander' },
    { label: '🥕 Native Carrot', value: 'Carrot' },
    { label: '🥦 Cauliflower', value: 'Cauliflower' }
  ];

  // Filtered products for retail market
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const targetCat = selectedCategory.toLowerCase().trim();
      const matchesVegetable = 
        selectedCategory === 'All' || 
        p.category.toLowerCase().includes(targetCat) ||
        p.name.toLowerCase().includes(targetCat);

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.farmer_name.toLowerCase().includes(query) ||
        p.village.toLowerCase().includes(query);

      return matchesVegetable && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Cart operations
  const handleAddToCart = (productId) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleUpdateQuantity = (productId, delta) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[productId];
      return copy;
    });
  };

  const handleClearCart = () => {
    setCart({});
  };

  // Switch to bulk requisition from retail card
  const handleOrderInBulk = (product) => {
    setReqCrop(`${product.name} (Grade A)`);
    setTargetCeilingPrice(product.price_per_kg || 30);
    setMarketMode('bulk');
    setBulkActiveTab('requisition');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Totals
  const cartItems = useMemo(() => {
    return Object.entries(cart).map(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      const subtotal = product ? product.price_per_kg * quantity : 0;
      const marketSubtotal = product ? (product.market_price_per_kg || product.price_per_kg * 1.3) * quantity : 0;
      return {
        product,
        quantity,
        subtotal,
        marketSubtotal
      };
    }).filter(item => Boolean(item.product));
  }, [cart, products]);

  const totalQuantity = useMemo(() => {
    return Object.values(cart).reduce((sum, q) => sum + q, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }, [cartItems]);

  const totalMarketPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.marketSubtotal, 0);
  }, [cartItems]);

  const totalSavings = Math.max(0, totalMarketPrice - totalPrice);

  // Retail Checkout submission
  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setCheckoutSubmitting(true);
    const buyerName = currentUser?.name || 'Customer (' + (currentUser?.email || 'Walk-in') + ')';
    const buyerEmail = currentUser?.email || 'customer.pickup@farmdirect.in';
    const primaryCrop = cartItems.map(i => `${i.product.name} (${i.quantity} ${i.product.unit})`).join(', ');

    await dbCreateOrder({
      buyerName,
      buyerEmail,
      role: 'consumer',
      cropName: primaryCrop,
      quantityKg: Math.round(totalQuantity),
      totalAmount: Math.round(totalPrice),
      status: 'pending_pickup',
      zone: selectedZone
    });

    const mockPin = Math.floor(1000 + Math.random() * 9000);
    const zoneName = zones.find(z => z.id === selectedZone)?.name || 'MVP Colony Cluster Hub';

    setOrderConfirmed({
      orderId: 'ORD-' + Math.floor(10000 + Math.random() * 90000),
      pickupOtp: mockPin,
      zoneName,
      items: cartItems,
      totalPrice
    });

    setCheckoutSubmitting(false);
    setCart({});

    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (_) {}
  };

  // Bulk Requisition Submit
  const handleSubmitRequisition = (e) => {
    e.preventDefault();
    const newOffer = {
      offerId: 'OFFER-FD-' + Math.floor(503 + Math.random() * 50),
      farmerName: 'Appala Raju',
      cluster: 'Padmanabham Agro-Corridor',
      crop: reqCrop,
      offeredQtyKg: reqQty,
      collarPrice: targetCeilingPrice - 2,
      marketSpotPrice: targetCeilingPrice + 8,
      matchScore: 97,
      distanceKm: 19,
      timeLimitMinutes: 120,
      trustTier: 'Tier A (95.0%)',
      eCropVerified: true,
      status: 'pending'
    };

    setMatchedOffers(prev => [newOffer, ...prev]);
    setRequisitionSubmitted(true);

    try {
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}

    setTimeout(() => {
      setRequisitionSubmitted(false);
      setBulkActiveTab('offers');
    }, 1800);
  };

  // Lock Offer in UPI Escrow
  const handleLockOffer = (offer) => {
    const totalCost = offer.offeredQtyKg * offer.collarPrice;
    const newActiveOrder = {
      orderId: 'BLK-ORD-' + Math.floor(4500 + Math.random() * 500),
      farmerName: offer.farmerName,
      cluster: offer.cluster,
      crop: offer.crop,
      quantityKg: offer.offeredQtyKg,
      agreedPrice: offer.collarPrice,
      totalAmount: totalCost,
      escrowStatus: 'Locked in UPI Escrow',
      scheduledDelivery: 'Tomorrow 06:30 AM',
      fulfillmentStatus: 'Confirmed & Awaiting Harvest'
    };

    setActiveOrders(prev => [newActiveOrder, ...prev]);
    setMatchedOffers(prev => prev.map(o => o.offerId === offer.offerId ? { ...o, status: 'locked' } : o));

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}

    setBulkActiveTab('escrow');
  };

  return (
    <div className="min-h-screen bg-[#F2EBDD] text-[#102F27] transition-colors duration-200">
      
      {/* =========================================================================
          TOP NAVBAR: MODE SELECTOR, SEARCHBAR, DROPDOWN, & PROFILE BUTTON
          ========================================================================= */}
      <header className="sticky top-0 z-30 bg-[#F2EBDD]/95 backdrop-blur-md border-b border-[#78947F]/30 px-4 sm:px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Brand & Back Button */}
          <div className="w-full md:w-auto flex items-center justify-between gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 -ml-1 rounded-xl text-[#102F27]/70 hover:text-[#102F27] hover:bg-[#FAF6EF] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4 text-[#185844]" />
              <span className="hidden sm:inline">Home</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#102F27] via-[#185844] to-[#102F27] flex items-center justify-center text-white shadow-sm border border-[#78947F]/30">
                <Sprout className="w-4 h-4 text-[#B08A4F]" />
              </div>
              <span className="text-base font-black tracking-tight text-[#102F27]">
                Customer <span className="text-[#185844]">Market</span>
              </span>
            </div>

            {/* Mobile Profile Trigger */}
            <button
              onClick={() => setProfileModalOpen(true)}
              className="md:hidden flex items-center gap-1.5 p-1.5 px-2.5 rounded-xl bg-[#FAF6EF] border border-[#78947F]/30 text-xs font-bold text-[#102F27]"
            >
              <User className="w-4 h-4 text-[#185844]" />
              <span className="max-w-[70px] truncate">{currentUser?.name?.split(' ')[0] || 'Profile'}</span>
            </button>
          </div>

          {/* Unified Mode Switcher: Retail vs Bulk vs Quality & Services */}
          <div className="flex items-center p-1 bg-[#FAF6EF] rounded-2xl border border-[#78947F]/35 shadow-inner">
            <button
              onClick={() => {
                setMarketMode('retail');
                window.location.hash = '#market';
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                marketMode === 'retail'
                  ? 'bg-[#185844] text-[#F2EBDD] shadow-sm'
                  : 'text-[#102F27]/70 hover:text-[#102F27]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Retail Market</span>
            </button>

            <button
              onClick={() => {
                setMarketMode('bulk');
                window.location.hash = '#bulk';
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                marketMode === 'bulk'
                  ? 'bg-[#185844] text-[#F2EBDD] shadow-sm'
                  : 'text-[#102F27]/70 hover:text-[#102F27]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Bulk Orders (50kg+)</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#B08A4F]/20 text-[#102F27] border border-[#B08A4F]/40">
                Collar Escrow
              </span>
            </button>

            <button
              onClick={() => {
                setMarketMode('tracking');
                window.location.hash = '#tracking';
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                marketMode === 'tracking'
                  ? 'bg-[#185844] text-[#F2EBDD] shadow-sm'
                  : 'text-[#102F27]/70 hover:text-[#102F27]'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-[#185844]" />
              <span>Live Order Tracking</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[#185844]/15 text-[#185844]">
                {trackedOrders.length}
              </span>
            </button>

            <button
              onClick={() => {
                setMarketMode('services');
                window.location.hash = '#services';
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                marketMode === 'services'
                  ? 'bg-[#185844] text-[#F2EBDD] shadow-sm'
                  : 'text-[#102F27]/70 hover:text-[#102F27]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#185844]" />
              <span>Customer Services & Lab Tests</span>
            </button>
          </div>

          {/* Retail Searchbar & Filter (Only active in retail mode) */}
          {marketMode === 'retail' ? (
            <div className="w-full md:flex-1 max-w-xl flex items-center gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vegetable or farmer..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-earth-darkCard/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Vegetable Dropdown Menu */}
              <div className="relative shrink-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-earth-darkCard border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer shadow-sm transition-all"
                >
                  {VEGETABLE_DROPDOWN_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              <span>Institutional Forward Requisitions & Escrow</span>
            </div>
          )}

          {/* Right Controls: Desktop Profile Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-sm"
              title="Customer Account Profile"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <span className="max-w-[110px] truncate text-slate-800 dark:text-slate-200">
                {currentUser?.name || 'Customer'}
              </span>
              <span className="text-[9px] font-mono px-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Verified
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* =========================================================================
          VIEW A: RETAIL / HOUSEHOLD VEGETABLES MARKETPLACE
          ========================================================================= */}
      {marketMode === 'retail' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Micro Banner: Direct From Farmer Guarantee */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-[#111D16] border border-emerald-500/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Fresh Sunrise Harvest • Zero Mandi Middlemen
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct from Anandapuram, Pendurthi & Sabbavaram farms. Ready for pickup at neighborhood Kirana hubs.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Pickup Hub:</span>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 cursor-pointer shadow-sm"
              >
                <option value="zone-mvp">MVP Colony (Cluster #1)</option>
                <option value="zone-seethammadhara">Seethammadhara (Cluster #4)</option>
                <option value="zone-nad">NAD Kotha Road Node</option>
                <option value="zone-rushikonda">Rushikonda IT SEZ Hub</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Products Grid (Left 2 Columns) */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Available Produce</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {filteredProducts.length} items
                  </span>
                </h3>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    Reset Filter
                  </button>
                )}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-slate-800 shadow-sm">
                  <Sprout className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No produce matches your search</h4>
                  <p className="text-xs text-slate-400 mt-1">Try searching for tomato, spinach, brinjal, or reset filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((p) => {
                    const inCartQty = cart[p.id] || 0;
                    const savingsPerKg = Math.max(0, (p.market_price_per_kg || p.price_per_kg * 1.3) - p.price_per_kg);

                    return (
                      <div
                        key={p.id}
                        className="bg-white dark:bg-[#111D16] rounded-2xl p-4 border border-slate-200/90 dark:border-emerald-500/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Top Badges */}
                          <div className="flex items-center justify-between mb-2.5">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {p.category}
                            </span>
                            {savingsPerKg > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                                Save ₹{Math.round(savingsPerKg)}/{p.unit}
                              </span>
                            )}
                          </div>

                          {/* Product Name */}
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {p.name}
                          </h4>

                          {/* Farmer & Location Details */}
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5 mb-3">
                            <p className="flex items-center gap-1">
                              <Sprout className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Farmer: <strong className="text-slate-700 dark:text-slate-200">{p.farmer_name}</strong></span>
                            </p>
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-amber-500" />
                              <span>{p.village}</span>
                            </p>
                            <p className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{p.harvest_time || 'Harvested at dawn'}</span>
                            </p>
                          </div>
                        </div>

                        {/* Price & Action Box */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                ₹{p.price_per_kg}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium">/{p.unit}</span>
                              {p.market_price_per_kg && (
                                <span className="ml-2 text-xs text-slate-400 line-through">
                                  ₹{p.market_price_per_kg}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                              Direct Price Collar
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {/* Retail Add to Cart Button */}
                            {inCartQty > 0 ? (
                              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-1">
                                <button
                                  onClick={() => handleUpdateQuantity(p.id, -1)}
                                  className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm shadow-sm"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">
                                  {inCartQty} {p.unit}
                                </span>
                                <button
                                  onClick={() => handleUpdateQuantity(p.id, 1)}
                                  className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(p.id)}
                                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add to Cart</span>
                              </button>
                            )}

                            {/* Direct Bulk Order (50kg+) Action */}
                            <button
                              onClick={() => handleOrderInBulk(p)}
                              className="w-full py-2 px-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                              title="Order in bulk (50kg+) for events or canteens"
                            >
                              <Building2 className="w-3 h-3" />
                              <span>Bulk (50kg+)</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Retail Checkout Box (Right Column) */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-white dark:bg-[#111D16] rounded-3xl p-5 border border-slate-200/90 dark:border-emerald-500/20 shadow-lg space-y-4">
                
                {/* Checkout Box Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Your Produce Box
                    </h3>
                  </div>
                  {cartItems.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="text-[11px] text-rose-500 hover:text-rose-600 font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Cart Items List */}
                {cartItems.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 space-y-2">
                    <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                    <p className="text-xs font-semibold">Your box is empty</p>
                    <p className="text-[11px] text-slate-400">Add fresh vegetables from the left to checkout.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {cartItems.map(({ product, quantity, subtotal }) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800/80 text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                            ₹{product.price_per_kg} × {quantity} {product.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{subtotal}
                          </span>
                          <button
                            onClick={() => handleRemoveFromCart(product.id)}
                            className="p-1 text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pricing Breakdown */}
                {cartItems.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-500/20 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Total Weight:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{totalQuantity} kg/units</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Mandi Retail Price:</span>
                      <span className="font-mono line-through text-slate-400">₹{Math.round(totalMarketPrice)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white border-t border-emerald-500/20 pt-2">
                      <span>FarmDirect Price:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">₹{totalPrice}</span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 text-center pt-1">
                        🎉 You save ₹{Math.round(totalSavings)} directly with zero middleman fee!
                      </div>
                    )}
                  </div>
                )}

                {/* Dual-OTP Handshake Notice */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dual-OTP Pick Up:</strong> You will receive a unique 4-digit pickup PIN upon confirmation. Show it at the Kirana hub to claim your crate.
                  </span>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || checkoutSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {checkoutSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Place Order (₹{totalPrice})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </div>
            </div>

          </div>
        </main>
      )}

      {/* =========================================================================
          VIEW B: BULK INSTITUTIONAL PROCUREMENT SYSTEM (50kg+ FORWARD CONTRACTS)
          ========================================================================= */}
      {marketMode === 'bulk' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Bulk Header Banner */}
          <div className="mb-6 p-5 rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Bulk Institutional Procurement Desk</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Large Volume Forward Requisitions & Collar Escrow
              </h2>
              <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
                Dedicated for hotels, hospital canteens, corporate cafeterias, and hostels. 
                Lock 14-day forward harvest contracts with verified smallholders at guaranteed price collar spreads.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                <span className="text-[10px] uppercase font-mono text-indigo-300 block">Min Batch</span>
                <span className="text-base font-black font-mono">50 kg</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                <span className="text-[10px] uppercase font-mono text-indigo-300 block">Transit Time</span>
                <span className="text-base font-black font-mono">&lt; 3 Hrs</span>
              </div>
            </div>
          </div>

          {/* Bulk Portal Sub-Tabs */}
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
            {[
              { id: 'offers', label: 'Matched Farmer Offers', count: matchedOffers.filter(o => o.status === 'pending').length, icon: Sparkles },
              { id: 'requisition', label: 'Post Bulk Requisition', icon: Plus },
              { id: 'escrow', label: 'UPI Escrow Ledger', count: activeOrders.length, icon: ShieldCheck },
              { id: 'logistics', label: 'Morning Dock Intake', icon: Truck }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = bulkActiveTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setBulkActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                      : 'bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* SUB-TAB 1: MATCHED FARMER OFFERS */}
          {bulkActiveTab === 'offers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Algorithmic Matching Waterfall
                  </h3>
                  <p className="text-xs text-slate-500">
                    Proposals matched by Gale-Shapley reverse-demand engine. Offers expire when timer counts down to 0.
                  </p>
                </div>
                <button
                  onClick={() => setBulkActiveTab('requisition')}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Requisition</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchedOffers.map(offer => (
                  <div
                    key={offer.offerId}
                    className="bg-white dark:bg-[#111D16] p-5 rounded-3xl border border-slate-200 dark:border-indigo-500/20 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300/40">
                          {offer.offerId}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{offer.timeLimitMinutes} min lock</span>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                        {offer.crop} ({offer.offeredQtyKg} kg)
                      </h4>

                      <div className="text-xs text-slate-500 space-y-1 mb-4">
                        <p>Farmer: <strong className="text-slate-800 dark:text-slate-200">{offer.farmerName}</strong> ({offer.trustTier})</p>
                        <p>Corridor: {offer.cluster} • {offer.distanceKm} km</p>
                      </div>

                      {/* Pricing Comparison */}
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs mb-4">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Collar Floor Price</span>
                          <span className="text-sm font-black text-emerald-600 font-mono">₹{offer.collarPrice}/kg</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Open Mandi Spot</span>
                          <span className="text-sm font-semibold line-through text-slate-400 font-mono">₹{offer.marketSpotPrice}/kg</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                        Total: ₹{offer.offeredQtyKg * offer.collarPrice}
                      </span>

                      {offer.status === 'locked' ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                          ✓ Offer Locked in Escrow
                        </span>
                      ) : (
                        <button
                          onClick={() => handleLockOffer(offer)}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Accept & Lock Escrow</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: POST BULK REQUISITION */}
          {bulkActiveTab === 'requisition' && (
            <div className="max-w-2xl mx-auto bg-white dark:bg-[#111D16] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-indigo-500/20 shadow-md">
              <div className="mb-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Post Institutional Bulk Requirement
                </h3>
                <p className="text-xs text-slate-500">
                  Broadcast forward volume requirements directly to Anakapalli and Pendurthi farmer clusters.
                </p>
              </div>

              {requisitionSubmitted ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold">Requisition Broadcasted to Farmers!</h4>
                  <p className="text-xs text-slate-500">Matching offers will appear in your waterfall in moments.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequisition} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Produce / Crop Required</label>
                    <input
                      type="text"
                      value={reqCrop}
                      onChange={(e) => setReqCrop(e.target.value)}
                      placeholder="e.g. Hybrid Tomato (Grade A)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-earth-darkCard text-xs font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Required Quantity (kg)</label>
                      <input
                        type="number"
                        min="50"
                        max="5000"
                        step="10"
                        value={reqQty}
                        onChange={(e) => setReqQty(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-earth-darkCard text-xs font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">Max Ceiling Price Collar (₹/kg)</label>
                      <input
                        type="number"
                        min="10"
                        max="200"
                        value={targetCeilingPrice}
                        onChange={(e) => setTargetCeilingPrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-earth-darkCard text-xs font-mono font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Quality Grade</label>
                      <select
                        value={reqGrade}
                        onChange={(e) => setReqGrade(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-earth-darkCard text-xs font-medium"
                      >
                        <option value="Grade A (Table-Ready Uniform)">Grade A (Table-Ready Uniform)</option>
                        <option value="Bulk Processing Grade">Bulk Processing Grade</option>
                        <option value="Institutional Mess Grade">Institutional Mess Grade</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Target Delivery Slot</label>
                      <select
                        value={deliverySlot}
                        onChange={(e) => setDeliverySlot(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-earth-darkCard text-xs font-medium"
                      >
                        <option value="Tomorrow 06:30 AM (Morning Kitchen Shift)">Tomorrow 06:30 AM (Morning Kitchen Shift)</option>
                        <option value="Tomorrow 05:00 PM (Evening Dinner Shift)">Tomorrow 05:00 PM (Evening Dinner Shift)</option>
                        <option value="14-Day Forward Supply Contract">14-Day Forward Supply Contract</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md cursor-pointer transition-all"
                  >
                    Publish Bulk Tender & Match Farmers
                  </button>
                </form>
              )}
            </div>
          )}

          {/* SUB-TAB 3: UPI ESCROW LEDGER */}
          {bulkActiveTab === 'escrow' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Active Contracts & UPI Escrow Ledger
                  </h3>
                  <p className="text-xs text-slate-500">
                    Funds remain securely locked in zero-trust escrow until physical morning dock verification.
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#111D16] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-mono text-slate-500">
                      <tr>
                        <th className="p-3.5">Order ID</th>
                        <th className="p-3.5">Produce & Volume</th>
                        <th className="p-3.5">Farmer & Cluster</th>
                        <th className="p-3.5">Collar Price</th>
                        <th className="p-3.5">Total Escrow</th>
                        <th className="p-3.5">Escrow State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {activeOrders.map(order => (
                        <tr key={order.orderId} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                          <td className="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {order.orderId}
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 dark:text-white block">{order.crop}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{order.quantityKg} kg</span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-medium text-slate-800 dark:text-slate-200 block">{order.farmerName}</span>
                            <span className="text-[10px] text-slate-400">{order.cluster}</span>
                          </td>
                          <td className="p-3.5 font-mono font-semibold">
                            ₹{order.agreedPrice}/kg
                          </td>
                          <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{order.totalAmount}
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" />
                              {order.escrowStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 4: MORNING DOCK INTAKE */}
          {bulkActiveTab === 'logistics' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Morning Receiving Bay Logistics (Porter 3PL)
                </h3>
                <p className="text-xs text-slate-500">
                  Produce bags are serialized with cryptographic QR seals. Dual-factor OTP handshake triggers escrow release.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dispatches.map(disp => (
                  <div key={disp.dispatchId} className="bg-white dark:bg-[#111D16] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{disp.dispatchId}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {disp.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                      <p>Carrier: <strong>{disp.driver}</strong></p>
                      <p>Load: {disp.crates} Tamper-Proof Crates ({disp.totalWeightKg} kg total)</p>
                      <p>Arrival: {disp.estArrival} IST</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <QrCode className="w-4 h-4" />
                        <span className="font-semibold">QR Tamper Seals Intact</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">PIN: 4892</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      )}

      {/* =========================================================================
          3. CUSTOMER SERVICES & QUALITY ASSURANCE DOMAIN VIEW
          ========================================================================= */}
      {marketMode === 'services' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-800 via-emerald-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-950 uppercase tracking-wide">
                Quality Assurance & Value-Added Services
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                Customer Services, NABL Lab Tests & Freshness Guarantee
              </h2>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl">
                Every crate dispatched through FarmDirect is backed by certified chemical residue analysis, continuous cold-chain telemetry, and an instant 2-hour replacement promise.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-teal-400 text-teal-950 flex items-center justify-center font-bold">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-teal-300">Customer Quality Helpline</p>
                <p className="text-xs font-mono font-bold text-white">+91 891 278-9000</p>
                <span className="text-[9px] text-emerald-200">2-Hour Rapid Resolution Desk</span>
              </div>
            </div>
          </div>

          {/* Service Toast Notice */}
          {serviceToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{serviceToast}</span>
              </div>
              <button onClick={() => setServiceToast('')} className="text-white/80 hover:text-white">✕</button>
            </div>
          )}

          {/* Quality Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-emerald-500/20 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Pesticide Residue</span>
              <p className="text-base font-black text-emerald-600">0.00% Organic Purity</p>
              <p className="text-[10px] text-slate-500">NABL GC-MS Verified Daily</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-emerald-500/20 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Cold Chain Transit</span>
              <p className="text-base font-black text-teal-600">9.6°C Stable Chill</p>
              <p className="text-[10px] text-slate-500">Live IoT Reefer Sensors</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-emerald-500/20 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Replacement SLA</span>
              <p className="text-base font-black text-indigo-600">&lt; 120 Minutes</p>
              <p className="text-[10px] text-slate-500">100% No-Questions-Asked</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-emerald-500/20 shadow-sm space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Eco-Crates Reused</span>
              <p className="text-base font-black text-amber-600">1,420 Crates Active</p>
              <p className="text-[10px] text-slate-500">₹50 UPI Deposit Refund</p>
            </div>
          </div>

          {/* Active Subscriptions Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-emerald-500/20 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your Active Vegetable Subscriptions</span>
              </h3>
              <button
                onClick={() => setActiveSubscriptionModal(true)}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-500 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Subscription</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userSubscriptions.map(sub => (
                <div key={sub.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{sub.title}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Deliveries: <span className="font-semibold text-slate-700 dark:text-slate-200">{sub.schedule}</span>
                    </p>
                    <p className="text-[10px] text-emerald-600 font-mono">Assigned Hub: {sub.hub}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{sub.id}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6 Grid Customer Services Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* SERVICE 1: NABL GC-MS Lab Certificate */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between hover:border-teal-500/50 transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-400 flex items-center justify-center shadow-sm">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    Food Safety & Residue Testing
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    NABL Lab Pesticide & Heavy Metal Certificates
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Every batch of tomatoes, palak, and bhendi undergoes Gas Chromatography-Mass Spectrometry (GC-MS) screening. Zero chemical residue guaranteed.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-[11px] text-teal-900 dark:text-teal-300 border border-teal-200 dark:border-teal-900/40 space-y-1">
                  <div className="flex justify-between">
                    <span>Organophosphates:</span>
                    <span className="font-bold text-emerald-600">Not Detected (0.00 ppm)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accreditation:</span>
                    <span className="font-semibold">NABL ISO/IEC 17025:2017</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveReportModal({
                  batchId: 'BATCH-AP-2026-T902',
                  testedCrops: 'Hybrid Vine Tomato (S-12) & Organic Palak',
                  labName: 'Vimta Labs Ltd (NABL Reg #TC-5412)',
                  date: 'Today, 04:30 AM',
                  parameters: [
                    { name: 'Chlorpyrifos', found: '0.00 mg/kg', limit: '0.05 mg/kg', result: 'Compliant' },
                    { name: 'Malathion', found: '0.00 mg/kg', limit: '0.10 mg/kg', result: 'Compliant' },
                    { name: 'Lead (Pb)', found: '0.02 mg/kg', limit: '0.10 mg/kg', result: 'Safe' },
                    { name: 'E. Coli count', found: '0 CFU/g', limit: '0 CFU/g', result: 'Pathogen Free' }
                  ]
                })}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View & Download Lab Certificate</span>
              </button>
            </div>

            {/* SERVICE 2: Weekly Farm Basket Subscription */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Recurring Fresh Deliveries
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    Weekly Farm-Direct Vegetable Basket Subscriptions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Never worry about daily grocery runs. Pre-reserve 5kg, 8kg, or 12kg crates of fresh seasonal vegetables harvested at dawn twice weekly.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-[11px] text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 space-y-1">
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="font-bold text-emerald-600">15% Off Retail Spot Price</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flexibility:</span>
                    <span className="font-semibold">Pause or skip anytime with 1 click</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveSubscriptionModal(true)}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Configure Recurring Basket</span>
              </button>
            </div>

            {/* SERVICE 3: Live Cold Chain IoT Telemetry */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between hover:border-cyan-500/50 transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-400 flex items-center justify-center shadow-sm">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    Live Cold-Chain Telemetry
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    Real-Time IoT Temperature & Route Tracking
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Track the exact thermal journey of your produce from Kasimkota farmgate to MVP Colony hub. Live Bluetooth data loggers ensure zero heat degradation.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 text-[11px] text-cyan-900 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900/40 space-y-1">
                  <div className="flex justify-between">
                    <span>Carrier AP-31-TE-1042:</span>
                    <span className="font-bold text-cyan-600 font-mono">9.6°C (Optimal)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Relative Humidity:</span>
                    <span className="font-semibold font-mono">88% (Crisp preservation)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setServiceToast('Telemetry verified: All active 3PL cold-chain reefers operating within 8°C - 12°C nominal window.');
                  try { confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } }); } catch (_) {}
                }}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Verify Live Transit Temperature</span>
              </button>
            </div>

            {/* SERVICE 4: 2-Hour Rapid Replacement & Refund Desk */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between hover:border-rose-500/50 transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-400 flex items-center justify-center shadow-sm">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Zero-Risk Freshness SLA
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    2-Hour Replacement & Spoilage Refund Desk
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Found broken tomatoes or overripe greens? Upload a photo for an immediate UPI refund or same-morning replacement crate dispatched in 2 hours.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-[11px] text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 space-y-1">
                  <div className="flex justify-between">
                    <span>Resolution Time:</span>
                    <span className="font-bold text-rose-600">Within 120 Minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guarantee:</span>
                    <span className="font-semibold">100% Cash Back to Original UPI</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveClaimModal(true)}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>File Spoilage / Damage Claim</span>
              </button>
            </div>

            {/* SERVICE 5: Eco-Crate Return & Deposit Cashback */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between hover:border-amber-500/50 transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 flex items-center justify-center shadow-sm">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Zero Single-Use Plastic
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    Eco-Crate Return & ₹50 UPI Deposit Refund
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Return reusable food-grade sanitized plastic crates at your local Kirana node or hand them back during morning delivery for an instant ₹50 cash refund.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-[11px] text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 space-y-1">
                  <div className="flex justify-between">
                    <span>Refund Per Crate:</span>
                    <span className="font-bold text-amber-600">₹50.00 Direct to UPI</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drop Points:</span>
                    <span className="font-semibold">Any of 18 Ward Kirana Hubs</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveCrateModal(true)}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Return Crate for ₹50 Refund</span>
              </button>
            </div>

            {/* SERVICE 6: Institutional Custom Procurement */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-emerald-500/20 shadow-sm flex flex-col justify-between hover:border-indigo-500/50 transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Institutional Catering & B2B
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                    Dedicated Key Account Manager & Custom Contracts
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Procuring 500kg+ daily for college mess, hospital, or hotel kitchens? Get customized delivery shifts, specialized vegetable grading, and Net-7 billing.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-[11px] text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/40 space-y-1">
                  <div className="flex justify-between">
                    <span>Corporate SLA:</span>
                    <span className="font-bold text-indigo-600">Net-7 Working Capital Terms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Key Manager:</span>
                    <span className="font-semibold">V. Satish (+91 94901 88210)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveContractDeskModal(true)}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Contact Institutional Desk</span>
              </button>
            </div>

          </div>

        </main>
      )}

      {/* =========================================================================
          4. CUSTOMER LIVE ORDER & COLD-CHAIN TRACKING PAGE
          ========================================================================= */}
      {marketMode === 'tracking' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Header Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-amber-950 uppercase tracking-wide mb-2">
                <Truck className="w-3.5 h-3.5" />
                <span>Hyperlocal Agri-Logistics & Escrow</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Live Order & Cold-Chain Tracking
              </h2>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl">
                Real-time visibility from Anakapalli & Visakhapatnam dawn harvests to your neighborhood Kirana Hub.
                Verify live Bluetooth reefer temperatures, view your Dual-OTP pickup PIN, and inspect verified digital weights.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 flex items-center gap-4 shrink-0">
              <div className="text-center">
                <span className="text-[10px] uppercase font-mono text-emerald-200 block">Active Orders</span>
                <span className="text-base font-black text-amber-300 font-mono">{trackedOrders.length} In Transit</span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-mono text-emerald-200 block">Total Escrow</span>
                <span className="text-base font-black text-white font-mono">
                  ₹{trackedOrders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <span className="text-[10px] uppercase font-mono text-emerald-200 block">Reefer Chill</span>
                <span className="text-base font-black text-emerald-300 font-mono">9.8°C</span>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Orders', count: trackedOrders.length },
                { id: 'retail', label: 'Kirana Hub Pickups', count: trackedOrders.filter(o => o.type === 'retail').length },
                { id: 'bulk', label: 'Bulk Dock Dispatches', count: trackedOrders.filter(o => o.type === 'bulk').length }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTrackingFilter(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    trackingFilter === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white dark:bg-[#111D16] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    trackingFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={trackingSearchQuery}
                onChange={(e) => setTrackingSearchQuery(e.target.value)}
                placeholder="Search Order ID (e.g. ORD-8941)..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-[#111D16] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              />
            </div>
          </div>

          {/* Tracked Orders List */}
          <div className="space-y-5">
            {trackedOrders
              .filter(o => trackingFilter === 'all' ? true : o.type === trackingFilter)
              .filter(o => {
                if (!trackingSearchQuery.trim()) return true;
                const q = trackingSearchQuery.toLowerCase();
                return o.orderId.toLowerCase().includes(q) || 
                       o.items.some(i => i.name.toLowerCase().includes(q)) ||
                       o.farmerName.toLowerCase().includes(q) ||
                       o.hubName.toLowerCase().includes(q);
              })
              .map(order => (
                <div
                  key={order.orderId}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#111D16] border border-slate-200 dark:border-emerald-500/20 shadow-sm space-y-5 hover:border-emerald-500/40 transition-all"
                >
                  {/* Top Bar: Order ID, Type, Date & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-0.5 rounded-lg border border-emerald-500/20">
                          {order.orderId}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.type === 'retail'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}>
                          {order.type === 'retail' ? 'Retail Sunrise Basket' : 'Bulk Forward Requisition'}
                        </span>
                        <span className="text-[11px] text-slate-400">Placed: {order.placedAt}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Status: <span className="text-emerald-600 dark:text-emerald-400">{order.status}</span>
                        </h3>
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Escrow Total Amount
                      </span>
                      <span className="text-xl font-black font-mono text-slate-900 dark:text-white">
                        ₹{order.totalAmount.toLocaleString('en-IN')}.00
                      </span>
                      <span className="text-[11px] block font-mono text-emerald-600 flex items-center justify-end gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>UPI Escrow Protected</span>
                      </span>
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Produce Items */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Harvest Produce in Batch:
                      </span>
                      <div className="space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="pt-1.5 first:pt-0 flex justify-between text-xs">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                            <span className="font-mono text-slate-500">{item.qty} • ₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>Farmer Origin:</span>
                        <span className="text-emerald-600 truncate max-w-[150px]">{order.farmerName} ({order.farmerVillage})</span>
                      </div>
                    </div>

                    {/* Delivery & Hub Destination */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {order.type === 'retail' ? 'Assigned Neighborhood Kirana Hub:' : 'Institutional Receiving Dock:'}
                      </span>
                      <p className="font-bold text-slate-900 dark:text-white text-xs">
                        {order.hubName}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{order.hubAddress}</span>
                      </p>
                      <div className="flex justify-between text-[11px] pt-1 border-t border-slate-200/60 dark:border-slate-800">
                        <span className="text-slate-400">Pickup Slot:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{order.pickupSlot}</span>
                      </div>
                    </div>

                    {/* Dual-OTP Security PIN or 3PL Telemetry Box */}
                    {order.type === 'retail' ? (
                      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 flex flex-col justify-between space-y-2">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-emerald-600" />
                              <span>Dual-OTP Pickup PIN</span>
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                              Show at Hub
                            </span>
                          </div>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-2xl font-black font-mono tracking-widest text-emerald-700 dark:text-emerald-300">
                              {order.pickupPin}
                            </span>
                            <span className="text-[10px] text-emerald-800/80 dark:text-emerald-400">
                              (Single-use secure PIN)
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">
                            Share this PIN with the Kirana owner or scan the QR code to verify your crate and release the farmer escrow.
                          </p>
                        </div>

                        <button
                          onClick={() => setActiveOtpModalOrder(order)}
                          className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Show QR Code & Pickup Pass</span>
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/30 flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-300 flex items-center gap-1">
                            <Truck className="w-3 h-3 text-indigo-600" />
                            <span>3PL Electric Reefer Van</span>
                          </span>
                          <div className="mt-1 space-y-0.5 text-xs">
                            <p className="font-bold text-slate-900 dark:text-white">{order.driverName}</p>
                            <p className="text-[11px] font-mono text-slate-500">Reg: {order.vehicleNumber}</p>
                            <div className="flex items-center gap-1.5 text-teal-600 font-mono font-bold text-xs mt-1">
                              <Thermometer className="w-3.5 h-3.5" />
                              <span>Cargo Temp: {order.transitTemp}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveTelemetryOrder(order)}
                          className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>View Live Reefer Sensor Stream</span>
                        </button>
                      </div>
                    )}

                  </div>

                  {/* 6-Step Visual Timeline Stepper */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                      Live Delivery & Verification Stepper:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                      {order.steps.map((step, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-2xl border text-xs flex flex-col justify-between transition-all ${
                            step.done
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                              : step.active
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/30'
                              : 'bg-slate-50 dark:bg-black/20 border-slate-200/60 dark:border-slate-800 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-[10px] font-bold">Step {idx + 1}</span>
                            {step.done ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : step.active ? (
                              <Activity className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                          </div>
                          <p className="font-bold text-[11px] line-clamp-2 leading-snug">
                            {step.title}
                          </p>
                          <span className="font-mono text-[9px] text-slate-500 mt-2 block">
                            {step.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Tamper-Sealed Bags • Calibrated Electronic Scale Gross Verified</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setServiceToast(`Navigating to ${order.hubName} (${order.hubAddress}). GPS route coordinates copied!`);
                          try { confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } }); } catch (_) {}
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Hub Directions</span>
                      </button>

                      <button
                        onClick={() => setActiveTelemetryOrder(order)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Thermometer className="w-3.5 h-3.5 text-teal-600" />
                        <span>Check IoT Sensor</span>
                      </button>

                      <button
                        onClick={() => {
                          setServiceToast('Freshness guarantee active! Any damaged or overripe produce is replaced within 2 hours or refunded to your UPI.');
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>2-Hour Quality SLA</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
          </div>

        </main>
      )}

      {/* =========================================================================
          LAB REPORT DETAIL MODAL
          ========================================================================= */}
      {activeReportModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveReportModal(null)}
        >
          <div 
            className="w-full max-w-lg bg-white dark:bg-[#111D16] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-teal-500/30 space-y-4 text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">NABL Certified Residue Report</h3>
                  <span className="text-[10px] font-mono text-slate-400">{activeReportModal.batchId}</span>
                </div>
              </div>
              <button onClick={() => setActiveReportModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tested Lot:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeReportModal.testedCrops}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Accredited Laboratory:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeReportModal.labName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sampling Timestamp:</span>
                  <span className="font-mono">{activeReportModal.date}</span>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">Chemical Residue Test Results (GC-MS / HPLC):</p>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
                  {activeReportModal.parameters.map((param, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between text-[11px] bg-slate-50/50 dark:bg-black/20">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{param.name}</span>
                        <span className="text-[10px] text-slate-400 ml-2">Limit: {param.limit}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-emerald-600 font-bold">{param.found}</span>
                        <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {param.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveReportModal(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setServiceToast(`Lab Certificate ${activeReportModal.batchId} downloaded to device storage.`);
                  setActiveReportModal(null);
                  try { confetti({ particleCount: 50, spread: 50 }); } catch (_) {}
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUBSCRIPTION CONFIGURATION MODAL
          ========================================================================= */}
      {activeSubscriptionModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveSubscriptionModal(false)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-[#111D16] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-emerald-500/30 space-y-4 text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Setup Farm Basket Subscription</h3>
              </div>
              <button onClick={() => setActiveSubscriptionModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-[11px] text-slate-400 font-bold mb-2">Select Basket Frequency & Size:</p>
                <div className="space-y-2">
                  {[
                    { id: 'weekly-single', title: 'Single Household (4kg Crate)', days: 'Every Saturday Morning', price: '₹140 / week' },
                    { id: 'biweekly-family', title: 'Family Fresh Pack (8kg Crate)', days: 'Tuesday & Friday Mornings', price: '₹260 / week' },
                    { id: 'institutional', title: 'Culinary Master Pack (15kg Crate)', days: 'Daily Morning Harvest', price: '₹480 / week' }
                  ].map(plan => (
                    <div
                      key={plan.id}
                      onClick={() => setSubscriptionPlan(plan.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        subscriptionPlan === plan.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-100'
                          : 'bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div>
                        <p className="font-bold text-xs">{plan.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{plan.days}</p>
                      </div>
                      <span className="font-bold text-emerald-600">{plan.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[11px] text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                Vegetables are packed at farm dawn (05:00 AM) and ready at MVP Colony Hub by 06:45 AM.
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveSubscriptionModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newSub = {
                    id: 'SUB-FD-' + Math.floor(104 + Math.random() * 50),
                    title: subscriptionPlan === 'biweekly-family' ? 'Family Fresh Pack (8kg)' : 'Weekly Single Crate (4kg)',
                    schedule: 'Every Tuesday & Friday Morning (06:30 AM)',
                    hub: 'MVP Colony Cluster Hub',
                    status: 'Active Subscription'
                  };
                  setUserSubscriptions(prev => [newSub, ...prev]);
                  setServiceToast(`Subscription active! First fresh crate scheduled for upcoming Tuesday dawn.`);
                  setActiveSubscriptionModal(false);
                  try { confetti({ particleCount: 70, spread: 60 }); } catch (_) {}
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-md"
              >
                Confirm Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SPOILAGE CLAIM & REFUND MODAL
          ========================================================================= */}
      {activeClaimModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveClaimModal(false)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-[#111D16] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-rose-500/30 space-y-4 text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">2-Hour Rapid Spoilage Claim</h3>
              </div>
              <button onClick={() => setActiveClaimModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Select Order ID:</label>
                <select className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 font-mono text-xs">
                  <option>ORD-8941 • Hybrid Vine Tomato (6 kg) • MVP Hub</option>
                  <option>ORD-8942 • Tender Green Bhendi (4 kg) • MVP Hub</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Issue Description:</label>
                <select className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 text-xs">
                  <option>Minor transit bruising / cracked skin</option>
                  <option>Produce weight variance (&gt; 2% discrepancy)</option>
                  <option>Overripe or wilting leaves</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Preferred Resolution:</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl border border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/30 font-semibold text-center cursor-pointer">
                    Instant UPI Refund (₹168)
                  </div>
                  <div className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-center cursor-pointer">
                    Replacement within 2h
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveClaimModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setServiceToast('Claim approved! ₹168 refund credited instantly to your linked UPI ID.');
                  setActiveClaimModal(false);
                  try { confetti({ particleCount: 70, spread: 60 }); } catch (_) {}
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-md"
              >
                Submit & Process Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ECO-CRATE RETURN MODAL
          ========================================================================= */}
      {activeCrateModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveCrateModal(false)}
        >
          <div 
            className="w-full max-w-sm bg-white dark:bg-[#111D16] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-amber-500/30 space-y-4 text-center text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
              <PackageCheck className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Eco-Crate Return & Cashback</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Drop your empty crate at any verified Kirana node in Visakhapatnam to reclaim your ₹50 deposit.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/40 space-y-1">
              <span className="text-[11px] text-amber-800 dark:text-amber-300 font-bold block">
                Your Eco-Crate Serial Code:
              </span>
              <p className="text-xl font-black font-mono tracking-wider text-amber-700 dark:text-amber-400">
                CRATE-FD-88192
              </p>
            </div>

            <button
              onClick={() => {
                setServiceToast('Crate scanned! ₹50.00 deposit refund credited to UPI.');
                setActiveCrateModal(false);
                try { confetti({ particleCount: 60, spread: 50 }); } catch (_) {}
              }}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              Verify Return & Cashout ₹50
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          INSTITUTIONAL DESK MODAL
          ========================================================================= */}
      {activeContractDeskModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveContractDeskModal(false)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-[#111D16] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-indigo-500/30 space-y-4 text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Institutional Procurement Desk</h3>
              </div>
              <button onClick={() => setActiveContractDeskModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-500 dark:text-slate-400">
                Connect directly with our Visakhapatnam Institutional Supply Coordinator for monthly recurring catering contracts with Net-7 invoicing.
              </p>

              <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Key Account Officer:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">V. Satish (B2B Lead)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Direct Phone:</span>
                  <span className="font-mono font-bold text-indigo-600">+91 94901 88210</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Corporate Email:</span>
                  <span className="font-mono">institutional@farmdirect.in</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setServiceToast('Inquiry logged! Key Account Officer V. Satish will connect with you in 30 minutes.');
                setActiveContractDeskModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
            >
              Request Immediate Callback
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          ORDER CONFIRMATION MODAL WITH DUAL-OTP PICKUP PIN
          ========================================================================= */}
      {orderConfirmed && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setOrderConfirmed(null)}
        >
          <div 
            className="w-full max-w-sm bg-white dark:bg-[#111D16] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-emerald-500/30 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Order Confirmed
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {orderConfirmed.orderId}
              </h3>
            </div>

            {/* OTP Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/30 space-y-1">
              <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 block">
                Your Kirana Depot Pick-Up PIN:
              </span>
              <div className="text-3xl font-black font-mono tracking-widest text-emerald-700 dark:text-emerald-400">
                {orderConfirmed.pickupOtp}
              </div>
              <p className="text-[10px] text-slate-400">
                Show this PIN at your neighborhood Kirana hub to release your crate.
              </p>
            </div>

            {/* Summary Details */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Hub:</span>
                <span className="font-semibold">{orderConfirmed.zoneName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Items:</span>
                <span className="font-semibold">{orderConfirmed.items.length} vegetables</span>
              </div>
              <div className="flex justify-between border-t border-slate-200/60 dark:border-slate-800 pt-1 font-bold">
                <span>Total Amount:</span>
                <span className="text-emerald-600">₹{orderConfirmed.totalPrice}</span>
              </div>
            </div>

            <button
              onClick={() => setOrderConfirmed(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          CUSTOMER DUAL-OTP & QR PICKUP PASS MODAL
          ========================================================================= */}
      {activeOtpModalOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveOtpModalOrder(null)}
        >
          <div 
            className="w-full max-w-sm bg-white dark:bg-[#111D16] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-emerald-500/30 text-center space-y-4 text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
                  <QrCode className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kirana Pickup Pass</h3>
                  <span className="text-[10px] font-mono text-emerald-600">{activeOtpModalOrder.orderId}</span>
                </div>
              </div>
              <button onClick={() => setActiveOtpModalOrder(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {/* QR Mock graphic with code */}
            <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-500/40 inline-block shadow-inner mx-auto">
              <div className="w-36 h-36 bg-slate-900 rounded-xl p-2 flex flex-col items-center justify-center text-white space-y-1">
                <QrCode className="w-24 h-24 text-white" />
                <span className="text-[9px] font-mono tracking-widest text-emerald-400">SCAN AT HUB</span>
              </div>
            </div>

            {/* Security PIN Display */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 block">
                Your Dual-OTP Handshake PIN
              </span>
              <div className="text-3xl font-black font-mono tracking-widest text-emerald-700 dark:text-emerald-300">
                {activeOtpModalOrder.pickupPin}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Kirana owner scans this QR or keys in this PIN. Once accepted, produce is handed over and farmer escrow is disbursed instantly.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 text-xs text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Kirana Hub:</span>
                <span className="font-semibold truncate max-w-[170px]">{activeOtpModalOrder.hubName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pickup Slot:</span>
                <span className="font-semibold">{activeOtpModalOrder.pickupSlot}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setServiceToast(`Pickup PIN ${activeOtpModalOrder.pickupPin} copied to clipboard!`);
                try { confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } }); } catch (_) {}
                setActiveOtpModalOrder(null);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Done / Copied PIN</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          COLD-CHAIN IOT TELEMETRY STREAM MODAL
          ========================================================================= */}
      {activeTelemetryOrder && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveTelemetryOrder(null)}
        >
          <div 
            className="w-full max-w-md bg-white dark:bg-[#111D16] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-teal-500/30 space-y-4 text-slate-800 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold">
                  <Thermometer className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Reefer IoT Telemetry</h3>
                  <span className="text-[10px] font-mono text-slate-400">Sensors AP-IOT-8841 • Bluetooth BLE</span>
                </div>
              </div>
              <button onClick={() => setActiveTelemetryOrder(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-500/30 text-center">
                  <span className="text-[10px] text-teal-800 dark:text-teal-300 uppercase font-bold block">Current Temp</span>
                  <span className="text-xl font-black font-mono text-teal-600 dark:text-teal-400">
                    {activeTelemetryOrder.transitTemp?.split(' ')[0] || '9.8°C'}
                  </span>
                  <span className="text-[9px] text-emerald-600 block mt-0.5">Optimal Chilled Window</span>
                </div>

                <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/30 text-center">
                  <span className="text-[10px] text-cyan-800 dark:text-cyan-300 uppercase font-bold block">Relative Humidity</span>
                  <span className="text-xl font-black font-mono text-cyan-600 dark:text-cyan-400">88% RH</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">Zero Wilt Preservation</span>
                </div>
              </div>

              {/* Vehicle & Corridor Data */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">3PL Carrier:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeTelemetryOrder.carrier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehicle Reg:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{activeTelemetryOrder.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Corridor Route:</span>
                  <span className="font-semibold">Kasimkota ➔ Anandapuram Bypass ➔ MVP Colony</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SLA Thermal Compliance:</span>
                  <span className="font-bold text-emerald-600">100% within 8°C - 12°C target</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero thermal spikes detected during transit. Cell wall integrity preserved.</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTelemetryOrder(null)}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
            >
              Close Telemetry Stream
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          PROFILE MODAL: DETAILS & SIGN OUT
          ========================================================================= */}
      {profileModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setProfileModalOpen(false)}
        >
          <div 
            className="w-full max-w-sm bg-white dark:bg-[#111D16] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-emerald-500/30 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Customer Account</h3>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-md">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentUser?.name || 'Customer Account'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                  {currentUser?.email || 'customer@farmdirect.in'}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Role: Customer (Retail & Bulk)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Hub:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">MVP Colony Ward (Cluster #1)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Order Capabilities:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">Retail Crate + 50kg+ Bulk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Platform Status:</span>
                <span className="font-bold text-emerald-600">Verified Consumer</span>
              </div>
            </div>

            {currentUser ? (
              <button
                onClick={() => {
                  setProfileModalOpen(false);
                  onSignOut();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setProfileModalOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <span>Login to Existing Account</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
