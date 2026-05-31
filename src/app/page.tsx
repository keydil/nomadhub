import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { fetchAllActiveVendors } from '@/app/actions';
import { EcosystemMapDynamic } from '@/components/landing/EcosystemMapDynamic';

export default async function Home() {
  const vendors = await fetchAllActiveVendors();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-slate-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-12 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
            Smart Management for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-500">
              Mobile F&B Businesses
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            NomadHub is an AI-powered platform designed specifically for food trucks, pop-ups, and mobile vendors. Manage your menu with AI, streamline your queues, and serve more customers effortlessly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8">
              Create Your Free Store
            </Button>
          </Link>
          <Link href="/mr-churraos">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 bg-white">
              View Customer Experience
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-slate-200 text-left">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">AI Menu Manager</h3>
            <p className="text-slate-600">Simply upload a photo of your food and let our AI generate mouth-watering titles, descriptions, and suggested pricing instantly.</p>
          </div>
          
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Smart Queuing</h3>
            <p className="text-slate-600">Customers join digitally and see dynamic wait times. Reduce crowds around your truck and improve the customer experience.</p>
          </div>

          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Live Dashboard</h3>
            <p className="text-slate-600">Monitor your active queues, toggle your store status with a tap, and stay in total control during busy rushes.</p>
          </div>
        </div>

        <section id="ecosystem" className="py-24 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
              {/* Decorative backgrounds */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-sky-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/3" />
              
              <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                <div className="flex-1 text-left space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                    Live Ecosystem
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Temukan Kuliner <br/>di Sekitarmu
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                    Jelajahi berbagai tenant F&B menarik yang menggunakan NomadHub. Dari kopi artisan hingga jajanan unik, semuanya ada dalam satu ekosistem.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                    <div>
                      <div className="text-3xl font-black text-sky-500">{vendors.length}</div>
                      <div className="text-sm font-semibold text-slate-500 mt-1">Active Tenants</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-emerald-500">
                        {vendors.filter(v => !v.is_manually_closed).length}
                      </div>
                      <div className="text-sm font-semibold text-slate-500 mt-1">Open Now</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 w-full lg:max-w-xl">
                  <div className="relative p-2 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                    <EcosystemMapDynamic vendors={vendors} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
