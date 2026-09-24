import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import LoginForm from './loginForm';
import LogoutButton from './logoutButton';

function formatPrice(value) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return {
    date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default async function AdmPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get('adm_session')?.value === 'ok';

  if (!isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#14110F] px-6 py-20">
        <LoginForm />
      </main>
    );
  }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .order('starts_at', { ascending: true });

  return (
    <main className="min-h-screen bg-[#14110F] px-6 pb-12 pt-32">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#EDE6D6]">Agendamentos</h1>
          <LogoutButton />
        </div>

        {error ? (
          <p className="mt-6 text-sm text-red-400">Não foi possível carregar os agendamentos.</p>
        ) : bookings.length === 0 ? (
          <p className="mt-6 text-sm text-[#EDE6D6]/60">Nenhum agendamento ainda.</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-sm border border-[#EDE6D6]/10">
            <table className="w-full min-w-[720px] text-left text-sm text-[#EDE6D6]">
              <thead className="bg-[#1C1815] text-[#EDE6D6]/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Telefone</th>
                  <th className="px-4 py-3 font-medium">Serviço</th>
                  <th className="px-4 py-3 font-medium">Preço</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                  <th className="px-4 py-3 font-medium">Hora</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDE6D6]/10">
                {bookings.map((booking) => {
                  const { date, time } = formatDateTime(booking.starts_at);
                  return (
                    <tr key={booking.id}>
                      <td className="px-4 py-3">{booking.client_name}</td>
                      <td className="px-4 py-3">
                        <a
                          href={`https://wa.me/55${booking.client_phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B08D57] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57]"
                        >
                          {booking.client_phone}
                        </a>
                      </td>
                      <td className="px-4 py-3">{booking.service_name}</td>
                      <td className="px-4 py-3">{formatPrice(booking.price)}</td>
                      <td className="px-4 py-3">{date}</td>
                      <td className="px-4 py-3">{time}</td>
                      <td className="px-4 py-3 capitalize">{booking.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
