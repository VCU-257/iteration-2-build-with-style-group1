const SuccessPage = () => {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-green-50 shadow-lg">
        <div className="card-body text-center">
          <div className="text-4xl font-bold text-green-700">Success!</div>
          <p className="mt-4 text-lg text-green-900">
            Your form was successfully submitted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
