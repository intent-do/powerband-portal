import { metadata } from './metadata';
import RootLayout from './layout';

export { metadata };

export default function ServerRootLayout({ children }) {
    return <RootLayout>{children}</RootLayout>;
} 