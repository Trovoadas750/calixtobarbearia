'use client';

import { useActionState } from 'react';
import { login } from './actions';

const initialState = { error: '' };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form
      action={formAction}
      className="w-full max-w-sm rounded-sm border border-[#EDE6D6]/10 bg-[#1C1815] p-6"
    >
      <span className="text-sm text-[#EDE6D6]/50">Usuário</span>
      <p className="mt-1 text-base font-medium text-[#EDE6D6]">ADM</p>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm text-[#EDE6D6]/70">Senha</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          className="w-full rounded-sm border border-[#EDE6D6]/10 bg-[#14110F] px-4 py-3 text-base text-[#EDE6D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57]"
        />
      </label>

      {state?.error && <p className="mt-3 text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-sm bg-[#B08D57] px-6 py-3 text-sm font-medium tracking-wide text-[#14110F] transition-colors duration-300 hover:bg-[#c7a06b] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B08D57] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1C1815]"
      >
        {pending ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
