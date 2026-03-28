import { documentationContent } from '../generated/docs-content';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { MermaidDiagram } from '../components/MermaidDiagram';

export function DocsPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff8eb_0%,#f8fafc_45%,#ffffff_100%)]" aria-label="Documentation page">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-amber-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(148,85,0,0.08)]">
          <p className="mb-3 inline-flex rounded-full bg-amber-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-900">
            Auto-generated documentation
          </p>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-900">
            Vedabase functionality and BDD documentation site
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            This page is rendered from generated source data so the documentation site stays aligned with the
            application routes, feature intent, and acceptance scenarios.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl bg-slate-950 px-5 py-4 text-slate-50">
              <p className="text-sm text-slate-300">Generated</p>
              <p className="mt-2 text-sm font-medium">{documentationContent.generatedAt}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-sm text-slate-500">Features</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {documentationContent.summary.featureCount}
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-sm text-slate-500">BDD scenarios</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {documentationContent.summary.scenarioCount}
              </p>
            </article>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2" aria-label="Feature documentation cards">
          {documentationContent.features.map((feature) => (
            <article
              key={feature.slug}
              className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900">
                  {feature.route}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {feature.personas.join(' / ')}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold text-slate-900">{feature.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.summary}</p>

              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Capabilities</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {feature.capabilities.map((capability) => (
                    <li key={capability} className="rounded-xl bg-slate-50 px-4 py-3">
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">User actions</h3>
                <ol className="mt-3 space-y-2 text-sm text-slate-700">
                  {feature.userActions.map((action, index) => (
                    <li key={action} className="flex gap-3 rounded-xl border border-slate-200 px-4 py-3">
                      <span className="font-semibold text-amber-700">{index + 1}.</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">BDD scenarios</h3>
                <div className="mt-3 space-y-3">
                  {feature.bddScenarios.map((scenario) => (
                    <section key={scenario.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <h4 className="text-base font-semibold text-slate-900">{scenario.title}</h4>
                      <p className="mt-3 text-sm text-slate-700">
                        <strong>Given</strong> {scenario.given}
                      </p>
                      <p className="mt-2 text-sm text-slate-700">
                        <strong>When</strong> {scenario.when}
                      </p>
                      <p className="mt-2 text-sm text-slate-700">
                        <strong>Then</strong> {scenario.then}
                      </p>
                    </section>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <MermaidDiagram chart={feature.sequence.mermaid} title={feature.sequence.title} />
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Generated markdown artifact</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            The same generator also emits a markdown artifact at
            {' '}
            <code>public/generated/functionality-bdd.md</code>
            {' '}
            so CI can validate docs content without depending on runtime rendering.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
