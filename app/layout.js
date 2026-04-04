import './globals.css';

export const metadata = {
  title: 'hello idea',
  description: 'Write it messy. Get clarity, purpose and perspective.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
