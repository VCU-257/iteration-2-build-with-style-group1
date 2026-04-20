import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Add24Regular,
  Delete24Regular,
  Home24Filled,
  Search24Regular,
  SlideTextTitleEditRegular,
} from "@fluentui/react-icons";
import { aggregatePayments, loadAllPayments } from "../../utils/payments";

const colors = [
  "#22c55e", // green
  "#3b82f6", // blue
  "#f59e0b", // orange
  "#ef4444", // red
  "#a855f7", // purple
  "#14b8a6", // teal
  "#eab308", // yellow
];
type PaymentCategory = {
  name: string;
  amount: number;
};

const DashboardPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<PaymentCategory[]>(() =>
    aggregatePayments(loadAllPayments()),
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [amountFilter, setAmountFilter] = useState("all");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<PaymentCategory | null>(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editError, setEditError] = useState("");

  const filteredPayments = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        amountFilter === "all"
          ? true
          : amountFilter === "above250"
            ? category.amount > 250
            : category.amount <= 250;

      return matchesSearch && matchesFilter;
    });
  }, [categories, searchTerm, amountFilter]);

  const chartData = useMemo(
    () =>
      filteredPayments.map((entry, index) => ({
        ...entry,
        color: colors[index % colors.length],
      })),
    [filteredPayments],
  );

  const totalAmount = filteredPayments.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  const topCategory =
    filteredPayments.length > 0
      ? filteredPayments.reduce((max, item) =>
          item.amount > max.amount ? item : max,
        )
      : null;

  const averageAmount =
    filteredPayments.length > 0 ? totalAmount / filteredPayments.length : 0;

  const handleDelete = (categoryName: string) => {
    const confirmDelete = window.confirm(`Delete "${categoryName}"?`);
    if (!confirmDelete) return;

    setCategories((prev) =>
      prev.filter((category) => category.name !== categoryName),
    );
  };

  const handleOpenEdit = (category: PaymentCategory) => {
    setSelectedCategory(category);
    setEditName(category.name);
    setEditAmount(category.amount.toString());
    setEditError("");
    setIsEditOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelectedCategory(null);
    setEditName("");
    setEditAmount("");
    setEditError("");
  };

  const handleSaveEdit = () => {
    const trimmedName = editName.trim();
    const amountValue = Number(editAmount);

    if (!trimmedName) {
      setEditError("Please enter a category name.");
      return;
    }

    if (!editAmount || amountValue <= 0) {
      setEditError("Please enter a valid amount greater than 0.");
      return;
    }

    if (!selectedCategory) return;

    setCategories((prev) =>
      prev.map((category) =>
        category.name === selectedCategory.name
          ? { ...category, name: trimmedName, amount: amountValue }
          : category,
      ),
    );

    handleCloseEdit();
  };

  return (
    <div className="min-h-screen bg-base-100 px-4 py-5">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div className="flex items-center gap-3">
          <Home24Filled className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Hello Haroon!</h1>
            <p className="text-sm text-base-content/70">
              Track and manage your budget in one place.
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-2xl">
          <div className="card-body gap-5 lg:grid lg:grid-cols-[2fr_1fr] lg:items-start">
            <div className="rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm transition duration-300 hover:scale-[1.01]">
              <div className="flex flex-col items-center gap-4">
                <div className="text-sm text-base-content/70">
                  Budget overview
                </div>
                <div className="h-60 w-full rounded-3xl bg-base-200 p-4 shadow-inner">
                  {chartData.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-base-content/70">
                      No chart data available.
                    </div>
                  ) : (
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

                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-base-content text-sm font-semibold"
                        >
                          ${totalAmount.toFixed(0)}
                        </text>

                        <Tooltip
                          formatter={(value) =>
                            typeof value === "number"
                              ? `$${value.toFixed(2)}`
                              : value
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-1 text-sm font-medium text-base-content/60">
                Quick Insights
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-3xl bg-base-300 p-4 shadow-sm">
                  <div className="text-sm text-base-content/70">
                    Visible categories
                  </div>
                  <div className="text-2xl font-bold text-base-content">
                    {filteredPayments.length}
                  </div>
                </div>

                <div className="rounded-3xl bg-base-300 p-4 shadow-sm">
                  <div className="text-sm text-base-content/70">
                    Visible amount
                  </div>
                  <div className="text-2xl font-bold text-base-content">
                    ${totalAmount.toFixed(2)}
                  </div>
                </div>

                <div className="rounded-3xl bg-base-300 p-4 shadow-sm">
                  <div className="text-sm text-base-content/70">
                    Top category
                  </div>
                  <div className="text-lg font-semibold text-base-content">
                    {topCategory ? topCategory.name : "N/A"}
                  </div>
                  <div className="text-sm text-base-content/70">
                    {topCategory
                      ? `$${topCategory.amount.toFixed(2)}`
                      : "No data"}
                  </div>
                </div>

                <div className="rounded-3xl bg-base-300 p-4 shadow-sm">
                  <div className="text-sm text-base-content/70">
                    Average payment
                  </div>
                  <div className="text-2xl font-bold text-base-content">
                    ${averageAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-start">
          <button
            type="button"
            onClick={() => navigate("/create")}
            className="btn btn-primary w-full max-w-xs gap-2 sm:w-auto"
          >
            <Add24Regular className="h-5 w-5" />
            Create a new Payment
          </button>
        </div>

        <div className="card bg-base-200 shadow-md">
          <div className="card-body gap-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Payment Categories</h2>
                <p className="text-sm text-base-content/70">
                  Search, filter, edit, and manage your payment categories.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="input input-bordered flex items-center gap-2">
                  <Search24Regular className="h-5 w-5 text-base-content/60" />
                  <input
                    type="text"
                    className="grow"
                    placeholder="Search payments"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </label>

                <select
                  className="select select-bordered"
                  value={amountFilter}
                  onChange={(e) => setAmountFilter(e.target.value)}
                >
                  <option value="all">All amounts</option>
                  <option value="above250">Above $250</option>
                  <option value="belowOrEqual250">$250 and below</option>
                </select>
              </div>
            </div>

            {filteredPayments.length === 0 ? (
              <div className="rounded-2xl bg-base-100 p-6 text-center text-base-content/70">
                <p className="mb-3">No payments match your search or filter.</p>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setSearchTerm("");
                    setAmountFilter("all");
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {filteredPayments.map((category, index) => (
                  <div
                    key={category.name}
                    className="card bg-base-100 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="card-body flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="h-12 w-12 rounded-full"
                          style={{
                            backgroundColor: colors[index % colors.length],
                          }}
                        />
                        <div>
                          <div className="font-medium text-base-content">
                            {category.name}
                          </div>
                          <div className="text-sm text-base-content/70">
                            ${category.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-ghost btn-square btn-sm"
                          aria-label={`Edit ${category.name}`}
                          onClick={() => handleOpenEdit(category)}
                        >
                          <SlideTextTitleEditRegular className="h-5 w-5" />
                        </button>

                        <button
                          className="btn btn-error btn-square btn-sm text-white"
                          aria-label={`Delete ${category.name}`}
                          onClick={() => handleDelete(category.name)}
                        >
                          <Delete24Regular className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-base-100 p-6 shadow-2xl">
            <h3 className="text-2xl font-bold">Edit Payment</h3>
            <p className="mt-1 text-sm text-base-content/70">
              Update the category name and amount.
            </p>

            {editError && (
              <div className="alert alert-error mt-4">
                <span>{editError}</span>
              </div>
            )}

            <div className="mt-5 flex flex-col gap-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Category Name</legend>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Amount</legend>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
              </fieldset>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCloseEdit}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
