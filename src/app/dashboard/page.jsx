import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
const token = cookies().get('token')?.value;
const user = token ? jwt.verify(token, process.env.JWT_SECRET) : null;

return <DashboardClient user={user} />;
}