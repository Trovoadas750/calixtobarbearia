import { logout } from './actions';

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-sm border border-[#EDE6D6]/10 px-4 py-2 text-sm font-medium tracking-wide text-[#EDE6D6]/80 transition-colors duration-300 hover:border-[#EDE6D6]/30 hover:text-[#EDE6D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57]"
      >
        Sair
      </button>
    </form>
  );
}
