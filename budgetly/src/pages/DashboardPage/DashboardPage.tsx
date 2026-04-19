import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Add24Regular, Home24Filled, SlideTextTitleEditRegular } from "@fluentui/react-icons";
import { aggregatePayments, loadAllPayments } from "../../utils/payments";

const colors = ["#199444", "#34d399", "#0f766e", "#166534", "#4d7c0f", "#689f38", "#1e3a0a"];

const DashboardPage = () => {
  const navigate = useNavigate();
  const payments = useMemo(() => loadAllPayments(), []);
  const paymentData = useMemo(() => aggregatePayments(payments), [payments]);
  const chartData = useMemo(
    () => paymentData.map((entry, index) => ({
      ...entry,
      color: colors[index % colors.length],
    })),
    [paymentData],
  );
  const totalAmount = paymentData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="min-h-screen bg-base-100 px-4 py-5">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div className="flex items-center gap-3">
          <Home24Filled className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Hello Haroon!</h1>
        </div>

        <div className="card bg-base-200 shadow-2xl">
          <div className="card-body gap-5 lg:grid lg:grid-cols-[2fr_1fr] lg:items-start">
            <div className="rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="text-sm text-base-content/70">
                  Budget overview
                </div>
                <div className="h-60 w-full rounded-3xl bg-base-200 p-4 shadow-inner">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="amount"
                        nameKey="name"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                      >
                        {chartData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => (typeof value === "number" ? `$${value.toFixed(2)}` : value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-3xl bg-base-300 p-4 shadow-sm">
                <div className="text-sm text-base-content/70">Total categories</div>
                <div className="text-xl font-semibold text-base-content">
                  {paymentData.length}
                </div>
              </div>
              <div className="rounded-3xl bg-base-300 p-4 shadow-sm">
                <div className="text-sm text-base-content/70">Total amount</div>
                <div className="text-xl font-semibold text-base-content">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-start">
          <button
            type="button"
            onClick={() => navigate("/create")}
            className="btn btn-primary w-full sm:w-auto max-w-xs gap-2"
          >
            <Add24Regular className="h-5 w-5" />
            Create a new Payment
          </button>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          {paymentData.map((category) => (
            <div key={category.name} className="card bg-base-200 shadow-sm">
              <div className="card-body flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-base-300"></div>
                  <div>
                    <div className="font-medium text-base-content">{category.name}</div>
                    <div className="text-sm text-base-content/70">
                      ${category.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
                <button className="btn btn-ghost btn-square btn-sm" aria-label={`Edit ${category.name}`}>
                  <SlideTextTitleEditRegular className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
