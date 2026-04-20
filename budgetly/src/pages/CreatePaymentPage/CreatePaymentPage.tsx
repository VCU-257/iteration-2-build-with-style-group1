import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "cally";
import { addPayment } from "../../utils/payments";
import { Add24Regular } from "@fluentui/react-icons";

const CreatePaymentPage = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [sender, setSender] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = Number(amount);
    const trimmedName = name.trim();
    const trimmedSender = sender.trim();

    if (!trimmedName) {
      setError("Please enter a payment name.");
      setSuccess("");
      return;
    }

    if (!amount || amountValue <= 0) {
      setError("Please enter a valid amount greater than 0.");
      setSuccess("");
      return;
    }

    if (!trimmedSender) {
      setError("Please enter the payment sender.");
      setSuccess("");
      return;
    }

    if (recurring && !startDate) {
      setError("Please select a start date for recurring payments.");
      setSuccess("");
      return;
    }

    setError("");

    addPayment({
      name: trimmedName,
      amount: amountValue,
      sender: trimmedSender,
      recurring,
      startDate,
    });

    setSuccess("Payment created successfully!");

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-base-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="flex items-center justify-center gap-2 text-3xl font-bold">
            <Add24Regular className="h-7 w-7" />
            Create a Payment
          </h1>
          <p className="mt-2 text-sm text-base-content/70">
            Fill out the form below to add a new payment to your budget.
          </p>
        </div>

        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Name</legend>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter payment name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Amount</legend>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Payment Sender</legend>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter sender name"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Recurring</legend>
                <div className="flex items-center justify-between rounded-xl bg-base-100 px-4 py-3">
                  <span className="text-sm font-medium">
                    {recurring
                      ? "Recurring payment enabled"
                      : "One-time payment"}
                  </span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={recurring}
                    onChange={(e) => setRecurring(e.target.checked)}
                  />
                </div>
              </fieldset>

              {recurring && (
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Start Date</legend>
                  <calendar-date
                    className="cally rounded-box border border-base-300 bg-base-100"
                    value={startDate}
                    onChange={(
                      e: React.ChangeEvent<HTMLElement & { value: string }>,
                    ) => setStartDate(e.target.value)}
                  >
                    <svg
                      aria-label="Previous"
                      className="size-4 fill-current"
                      slot="previous"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      />
                    </svg>
                    <svg
                      aria-label="Next"
                      className="size-4 fill-current"
                      slot="next"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                    <calendar-month />
                  </calendar-date>
                </fieldset>
              )}

              <button
                type="submit"
                className="btn btn-primary mt-2 w-full rounded-full"
              >
                Submit Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePaymentPage;
