/** Re-mounts on navigation, giving each page a soft fade-in transition. */
export default function StoreTemplate({ children }: { children: React.ReactNode }) {
  return <div className="animate-fade-in">{children}</div>;
}
