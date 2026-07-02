# Engineering Report: MoneyManager App

## 1. Why did you choose `react-native-chart-kit` over `react-native-svg-charts` or `victory-native`?

I selected `react-native-chart-kit` (paired with `react-native-svg`) primarily for its **simplicity, reliability, and lightweight footprint**.
For the `DashboardScreen`, the requirement was a clear, straightforward visual representation of cash flow (Income vs. Expense) via a simple bar or pie chart.

- **Complexity Overhead:** `victory-native` and `react-native-svg-charts` offer immense customization but require significant boilerplate, scale calculations, and data massaging. `react-native-chart-kit` handles the rendering of simple pie/bar charts out-of-the-box with simple data arrays.
- **Performance:** It has a smaller footprint compared to Victory, keeping bundle size down.
- **Animations and Stability:** It avoids some of the deeper animation layout issues occasionally seen with more complex SVG composer libraries in React Native, ensuring stable production drops.

## 2. How did you handle the paise-to-rupee conversion safely?

Financial applications must never use floating-point math for state or database storage due to JavaScript IEEE-754 precision issues (e.g., `0.1 + 0.2 === 0.30000000000000004`).

**My Approach:**
1. **Form State (String):** The UI strictly holds the raw string input (e.g., `"150.50"`) inside the `useForm` state. This prevents jarring cursor jumps or auto-formatting issues while the user types.
2. **Validation:** Zod validates the raw string using a regex (`/^\d+(\.\d{1,2})?$/`) to ensure it is a valid positive decimal up to 2 places.
3. **Conversion on Submit:** Exactly at the service boundary (during the form `onSubmit` handler in `AddTransactionScreen`), the string is parsed, multiplied by 100, and aggressively rounded to an integer (`Math.round(parseFloat(val) * 100)`).
4. **Storage:** The Realtime DB stores strictly integer paise/cents.
5. **Display:** When rendering `BalanceCard` or `TransactionRow`, a formatting function divides by 100 and applies `.toFixed(2)` safely (`(amount / 100).toFixed(2)`).

## 3. Explain your routing approach to protecting the `(app)` tab layout from unauthenticated users.

I protected the `(app)` root layout using a declarative approach utilizing **`expo-router`'s `<Redirect href="/(auth)/login" />` component** rather than imperative navigation inside a `useEffect` hook.

**Why this matters:**
- **Avoids Unnecessary Mounting:** Imperative approaches (`router.replace()`) require the protected component to actually mount and render its initial frame before the `useEffect` fires. This leads to flashing sensitive UI or making protected API calls before the router can interrupt.
- **Declarative guarantees:** Returning `<Redirect />` strictly at render-time ensures that the protected visual tree is completely bypassed if `!user` is true. The router instantly handles the redirect natively, offering a completely seamless transition without flicker.
- **Sync vs Async state:** Because Firebase `AsyncStorage` persistence dictates auth state, we rely on the `useAuth` hook which delays rendering (returning `null` or a loading spinner) until the initialization phase is complete. Once `isLoading` resolves, the router can definitively evaluate `user ? <Tabs /> : <Redirect />`.
