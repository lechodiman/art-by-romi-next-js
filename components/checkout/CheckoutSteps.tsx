interface CheckoutStepsProps {
  currentStep: number;
  totalSteps: number;
}

export function CheckoutSteps({ currentStep, totalSteps }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {Array.from({ length: totalSteps }, (_, index) => index + 1).map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step
                  ? 'bg-zinc-700 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step}
            </div>
            {step < totalSteps && (
              <div
                className={`w-24 h-1 ${
                  currentStep > step ? 'bg-zinc-700' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}