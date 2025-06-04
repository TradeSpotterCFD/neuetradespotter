// src/components/BrowseByCategory.tsx
import Link from "next/link";

export function BrowseByCategory() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Browse by Category</h2>
        <p className="text-gray-600 text-center mb-12">
          Find the perfect broker based on trading type, payment options, or special features
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* CFD Trading */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9H21M7 15H17M12 3V21M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">CFD Trading</h3>
            <p className="text-gray-600 text-center mb-4">42 brokers</p>
            <Link href="/cfd-trading" className="text-blue-600 hover:text-blue-800">
              View Brokers
            </Link>
          </div>
          
          {/* Futures Trading */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21M3 18H21M7 15L12 9L16 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Futures Trading</h3>
            <p className="text-gray-600 text-center mb-4">36 brokers</p>
            <Link href="/futures-trading" className="text-blue-600 hover:text-blue-800">
              View Brokers
            </Link>
          </div>

          {/* Future Brokers (New) */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-4"> {/* Changed color */}
              <svg className="w-12 h-12 text-purple-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> {/* Changed color */}
                {/* Using a different icon, e.g., trending up */}
                <path d="M23 6L13.5 15.5L8.5 10.5L1 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 6H23V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Future Brokers</h3> {/* Changed title */}
            <p className="text-gray-600 text-center mb-4">15 brokers</p> {/* Placeholder count */}
            <Link href="/future-brokers" className="text-blue-600 hover:text-blue-800"> {/* Changed link */}
              View Brokers
            </Link>
          </div>
          
          {/* Crypto Exchanges */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-yellow-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Crypto Exchanges</h3>
            <p className="text-gray-600 text-center mb-4">28 brokers</p>
            <Link href="/crypto-exchanges" className="text-blue-600 hover:text-blue-800">
              View Brokers
            </Link>
          </div>
          
          {/* Aktien */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 3V21M3 18H21M7 15L12 9L16 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Aktien</h3>
            <p className="text-gray-600 text-center mb-4">98 brokers</p>
            <Link href="/aktien" className="text-blue-600 hover:text-blue-800">
              View Brokers
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}