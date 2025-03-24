export default function InfoSection() {
  return (
    <section className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-medium text-gray-800 mb-4">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3">
            <i className="fas fa-user-plus text-xl"></i>
          </div>
          <h3 className="font-medium text-gray-800 mb-1">1. Add Names</h3>
          <p className="text-gray-600 text-sm">
            Enter names individually or use the bulk add feature for multiple names at once.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
            <i className="fas fa-random text-xl"></i>
          </div>
          <h3 className="font-medium text-gray-800 mb-1">2. Generate Pairs</h3>
          <p className="text-gray-600 text-sm">
            Click the generate button to randomly pair names. Odd numbers will create one individual.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-3">
            <i className="fas fa-sync-alt text-xl"></i>
          </div>
          <h3 className="font-medium text-gray-800 mb-1">3. Reshuffle As Needed</h3>
          <p className="text-gray-600 text-sm">
            Not happy with the pairs? Easily regenerate for different combinations.
          </p>
        </div>
      </div>
    </section>
  );
}
