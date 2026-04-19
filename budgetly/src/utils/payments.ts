export type Payment = {
  id: string;
  name: string;
  amount: number;
  sender: string;
  recurring: boolean;
  startDate: string;
  createdAt: string;
};

const STORAGE_KEY = "budgetlyPayments";

export const DEFAULT_PAYMENTS: Payment[] = [
  {
    id: "default-electricity",
    name: "Electricity",
    amount: 300,
    sender: "",
    recurring: false,
    startDate: "",
    createdAt: "",
  },
  {
    id: "default-water",
    name: "Water",
    amount: 200,
    sender: "",
    recurring: false,
    startDate: "",
    createdAt: "",
  },
  {
    id: "default-groceries",
    name: "Groceries",
    amount: 250,
    sender: "",
    recurring: false,
    startDate: "",
    createdAt: "",
  },
  {
    id: "default-rent",
    name: "Rent",
    amount: 250,
    sender: "",
    recurring: false,
    startDate: "",
    createdAt: "",
  },
];

function parseStorage(): Payment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const stored = JSON.parse(raw);
    if (!Array.isArray(stored)) {
      return [];
    }

    return stored.map((item) => ({
      id: item.id ?? `${Date.now()}-${Math.random()}`,
      name: String(item.name ?? ""),
      amount: Number(item.amount ?? 0),
      sender: String(item.sender ?? ""),
      recurring: Boolean(item.recurring ?? false),
      startDate: String(item.startDate ?? ""),
      createdAt: String(item.createdAt ?? new Date().toISOString()),
    }));
  } catch {
    return [];
  }
}

export function loadStoredPayments(): Payment[] {
  return parseStorage();
}

export function loadAllPayments(): Payment[] {
  return [...DEFAULT_PAYMENTS, ...loadStoredPayments()];
}

export function saveStoredPayments(payments: Payment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
}

export function addPayment(payment: Omit<Payment, "id" | "createdAt">) {
  const stored = loadStoredPayments();
  const nextPayment: Payment = {
    ...payment,
    id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
    createdAt: new Date().toISOString(),
  };
  saveStoredPayments([...stored, nextPayment]);
}

export function aggregatePayments(payments: Payment[]) {
  const result = new Map<string, { name: string; amount: number }>();

  payments.forEach((payment) => {
    const existing = result.get(payment.name);
    if (existing) {
      existing.amount += payment.amount;
      result.set(payment.name, existing);
    } else {
      result.set(payment.name, { name: payment.name, amount: payment.amount });
    }
  });

  return Array.from(result.values());
}
