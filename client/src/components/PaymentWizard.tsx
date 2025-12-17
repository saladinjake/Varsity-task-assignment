import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, X, ChevronRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { createPaymentSession, enrollInCourse, verifyPaystackPayment } from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...placeholder');

interface PaymentWizardProps {
  course: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentWizard({ course, onClose, onSuccess }: PaymentWizardProps) {
  const [step, setStep] = useState<'method' | 'processing' | 'stripe' | 'paystack' | 'simulated' | 'success' | 'error'>('method');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paystack' | 'simulated' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const startPayment = async (method: 'stripe' | 'paystack' | 'simulated') => {
    setLoading(true);
    setPaymentMethod(method);
    try {
      const session = await createPaymentSession({ courseId: course.id, paymentMethod: method });
      
      if (session.mode === 'simulated') {
        setStep('simulated');
      } else if (method === 'stripe') {
        setClientSecret(session.clientSecret);
        setStep('stripe');
      } else if (method === 'paystack') {
        initiatePaystack(session.access_code, session.reference);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to initialize payment');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const initiatePaystack = (accessCode: string, reference: string) => {
    // @ts-ignore
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLISHABLE_KEY || 'pk_test_...placeholder',
      email: 'student@example.com', // In real app, use auth user email
      amount: course.price * 100 * 1500, // NGN mock calculation
      currency: 'NGN',
      ref: reference,
      access_code: accessCode,
      callback: async (response: any) => {
        setStep('processing');
        try {
          await verifyPaystackPayment(response.reference);
          await finishEnrollment('paystack', response.reference);
        } catch (e) {
          setError('Payment verification failed');
          setStep('error');
        }
      },
      onClose: () => {
        toast.error('Payment cancelled');
      }
    });
    handler.openIframe();
  };

  const finishEnrollment = async (method: string, paymentId: string) => {
    try {
      await enrollInCourse({ courseId: course.id, paymentMethod: method, paymentId });
      setStep('success');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0ea5e9', '#6366f1', '#10b981']
      });
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err) {
      setError('Enrollment step failed after payment. Please contact support.');
      setStep('error');
    }
  };

  const handleSimulatedPayment = async () => {
    setLoading(true);
    try {
      const paymentId = 'SIM-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      await finishEnrollment('simulated', paymentId);
    } catch (e) {
      setError('Simulation failed');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">Course Enrollment</h3>
            <p className="text-sm text-slate-500 font-medium">Step: {step === 'method' ? 'Choose Payment' : 'Review & Pay'}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'method' && (
              <motion.div 
                key="method"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-4"
              >
                <div className="bg-slate-50 p-6 rounded-2xl mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Product</span>
                    <span className="text-sm font-bold text-slate-900">${course.price}</span>
                  </div>
                  <h4 className="font-black text-slate-900">{course.title}</h4>
                </div>

                <PaymentMethodButton 
                  icon={<CreditCard className="text-sky-500" />}
                  title="Stripe International"
                  description="Visa, Mastercard, Amex, Apple Pay"
                  onClick={() => startPayment('stripe')}
                  loading={loading && paymentMethod === 'stripe'}
                />

                <PaymentMethodButton 
                  icon={<ShieldCheck className="text-emerald-500" />}
                  title="Paystack Checkout"
                  description="NGN/GHS, Bank Transfer, Card, USSD"
                  onClick={() => startPayment('paystack')}
                  loading={loading && paymentMethod === 'paystack'}
                />

                <button 
                  onClick={() => startPayment('simulated')}
                  className="mt-4 text-center text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Switch to Dashboard Simulation Mode
                </button>
              </motion.div>
            )}

            {step === 'stripe' && clientSecret && (
              <motion.div 
                key="stripe"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-6"
              >
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripeCheckoutForm 
                    course={course} 
                    clientSecret={clientSecret}
                    onSuccess={(pi: any) => finishEnrollment('stripe', typeof pi === 'string' ? pi : pi.id)} 
                    onError={(msg: string) => { setError(msg); setStep('error'); }}
                  />
                </Elements>
              </motion.div>
            )}

            {step === 'simulated' && (
              <motion.div 
                key="simulated"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center flex flex-col items-center gap-6 py-8"
              >
                <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                  <ShieldCheck size={40} />
                </div>
                <h4 className="text-2xl font-black text-slate-900">Virtual Dashboard Ready</h4>
                <p className="text-slate-500 text-sm">Testing simulation mode for developmental purposes. No real funds will be deducted.</p>
                <button 
                  onClick={handleSimulatedPayment}
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Confirm Virtual Enrollment'}
                </button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center flex flex-col items-center gap-6 py-8"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900">Access Granted!</h4>
                  <p className="text-slate-500 text-sm mt-2">Redirecting to your course dashboard...</p>
                </div>
              </motion.div>
            )}

            {step === 'error' && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center flex flex-col items-center gap-6 py-8"
              >
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
                  <AlertCircle size={40} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900">Transaction Failed</h4>
                  <p className="text-rose-500/70 text-sm mt-2 font-medium">{error || 'Unknown error occurred'}</p>
                </div>
                <button 
                  onClick={() => setStep('method')}
                  className="w-full py-4 border border-slate-200 text-slate-600 rounded-2xl font-black hover:bg-slate-50 transition-all"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div 
                key="processing"
                className="text-center flex flex-col items-center gap-6 py-8"
              >
                <Loader2 size={48} className="text-sky-500 animate-spin" />
                <h4 className="text-2xl font-black text-slate-900">Verifying Transaction</h4>
                <p className="text-slate-500 text-sm">Please do not refresh the page...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-8 pb-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[2px] text-slate-400">
          <ShieldCheck size={12} />
          Secured by Varsity Financial Network
        </div>
      </motion.div>
    </div>
  );
}

function PaymentMethodButton({ icon, title, description, onClick, loading }: any) {
  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-4 p-5 border border-slate-100 rounded-2xl hover:border-sky-500 hover:bg-sky-50/50 transition-all group text-left ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
        {loading ? <Loader2 className="animate-spin text-sky-500" /> : icon}
      </div>
      <div className="flex-1">
        <h5 className="font-black text-slate-900">{title}</h5>
        <p className="text-xs text-slate-500 font-medium">{description}</p>
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-sky-500" />
    </button>
  );
}

function StripeCheckoutForm({ course, onSuccess, onError, clientSecret }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret, 
      {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      }
    );

    if (error) {
      onError(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent);
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="p-4 border border-slate-200 rounded-xl">
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#0f172a',
              '::placeholder': { color: '#94a3b8' },
            },
          },
        }} />
      </div>
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full py-4 bg-sky-500 text-white rounded-2xl font-black hover:bg-sky-400 transition-all flex items-center justify-center gap-2"
      >
        {processing ? <Loader2 className="animate-spin" /> : `Pay $${course.price}`}
      </button>
    </form>
  );
}
