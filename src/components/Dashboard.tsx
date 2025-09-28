import React from 'react';
import { JIBCHAIN_RPC_ENDPOINTS } from '../utils/blockchain-constants';

const PRIMARY_RPC = 'https://rpc2-l1.jbc.xpool.pw' as const;
const STORE_ADDRESS = '0xCd3Ec17ddFDa24f8F97131fa0FDf20e7cbd1A8Bb' as const;

const Dashboard: React.FC = () => {
  const backupRpcs = Array.from(
    new Set(
      JIBCHAIN_RPC_ENDPOINTS.filter((endpoint) => endpoint !== PRIMARY_RPC)
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-800/70 bg-slate-900/50 p-8 shadow-2xl shadow-slate-900/30 backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">
            Loading blockchain data...
          </p>

          <div className="mt-6 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-900/80 ring-1 ring-slate-700/70">
              <img
                src="/floodboy-logo.png"
                alt="FloodBoy logo"
                className="h-16 w-16 object-contain"
                loading="lazy"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">FloodBoy Logo</p>
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">FloodBoy: IoT-Powered Blockchain</h1>
              <p className="mt-4 max-w-xl text-base text-slate-300">
                Live blockchain telemetry for real-time flood monitoring. Stay informed about
                sensor performance and data availability directly on-chain.
              </p>
            </div>
          </div>

          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6">
              <dt className="text-xs uppercase tracking-[0.25em] text-slate-400">Primary RPC</dt>
              <dd className="mt-3 font-mono text-lg text-sky-300 break-all">{PRIMARY_RPC}</dd>
              <p className="mt-4 text-sm text-slate-400">Waiting for network handshake…</p>
            </div>

            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6">
              <dt className="text-xs uppercase tracking-[0.25em] text-slate-400">Store Address</dt>
              <dd className="mt-3 font-mono text-lg text-emerald-300 break-all">{STORE_ADDRESS}</dd>
              <p className="mt-4 text-sm text-slate-400">Alias: FloodBoy001</p>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-slate-800/70 bg-slate-900/40 p-8 backdrop-blur">
          <h2 className="text-base font-semibold uppercase tracking-[0.3em] text-slate-300">
            Backup RPC Endpoints
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Waiting to be loaded. When the primary endpoint is unavailable the FloodBoy dashboard
            will seamlessly switch to one of these backups.
          </p>

          <ul className="mt-6 space-y-3">
            {backupRpcs.map((endpoint) => (
              <li
                key={endpoint}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/60 px-5 py-4"
              >
                <span className="font-mono text-sm text-slate-100 break-all">{endpoint}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Standby
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;