import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Intake() {
  const params = useParams<{ publicKey: string }>();
  const publicKey = params.publicKey;
  const nicheQuery = trpc.niches.getPublic.useQuery(
    { publicKey },
    { enabled: Boolean(publicKey) }
  );
  const createLead = trpc.leads.intake.useMutation();
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    notes: "",
    website: "",
  });
  const update =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(current => ({ ...current, [key]: event.target.value }));
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    createLead.mutate(
      {
        publicKey,
        ...form,
      },
      {
        onSuccess: () => setSubmitted(true),
        onError: error => toast.error(error.message),
      }
    );
  };

  if (nicheQuery.isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f7fb]">
        <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
      </div>
    );
  if (!nicheQuery.data)
    return (
      <div className="min-h-screen bg-[#f7f7fb] px-6 py-8 text-[#17151f]">
        <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl border border-violet-100 bg-white p-8 text-center shadow-[0_20px_70px_rgba(50,40,90,0.08)] sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
              <span className="text-xl font-extrabold tracking-[-0.08em]">
                A
              </span>
            </div>
            <div className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
              AION intake lane
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
              This acquisition lane is unavailable.
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              The niche may be inactive or no longer available. Return to the
              cockpit to choose another lane.
            </p>
            <Link href="/">
              <Button className="mt-7 rounded-xl bg-[#17151f] text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to AION
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f7f7fb] px-5 py-8 text-[#17151f] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 rounded-xl text-slate-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to AION
          </Button>
        </Link>
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="pt-4">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              AION intake
            </div>
            <h1 className="text-4xl font-semibold tracking-[-0.05em]">
              Tell us what you need.
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              This form routes your request into the {nicheQuery.data.name}{" "}
              pipeline so the right person can follow up quickly.
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                Your consent is recorded with the request.
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                You can opt out of follow-up at any time.
              </div>
            </div>
          </div>
          <Card className="rounded-2xl border-0 bg-white shadow-[0_20px_70px_rgba(50,40,90,0.08)]">
            {submitted ? (
              <CardContent className="flex min-h-[440px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold tracking-tight">
                  Request received.
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  Your request has been added to the {nicheQuery.data.name}{" "}
                  pipeline. Someone will be in touch soon.
                </p>
              </CardContent>
            ) : (
              <form onSubmit={submit}>
                <CardHeader className="px-6 pb-2 pt-6">
                  <CardTitle className="text-lg">
                    {nicheQuery.data.name}
                  </CardTitle>
                  <p className="text-sm text-slate-500">
                    A few details help us route your request correctly.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6 pt-5">
                  <input
                    aria-hidden="true"
                    autoComplete="off"
                    className="absolute -left-[10000px] h-px w-px overflow-hidden"
                    name="website"
                    tabIndex={-1}
                    value={form.website}
                    onChange={update("website")}
                  />
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      className="mt-2 rounded-xl"
                      value={form.name}
                      onChange={update("name")}
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        className="mt-2 rounded-xl"
                        value={form.email}
                        onChange={update("email")}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        className="mt-2 rounded-xl"
                        value={form.phone}
                        onChange={update("phone")}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="serviceType">Service type</Label>
                    <Input
                      id="serviceType"
                      className="mt-2 rounded-xl"
                      placeholder="What can we help with?"
                      value={form.serviceType}
                      onChange={update("serviceType")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      className="mt-2 min-h-24 rounded-xl"
                      placeholder="Context, timing, or anything else we should know"
                      value={form.notes}
                      onChange={update("notes")}
                    />
                  </div>
                  <label className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                    <Checkbox
                      checked={consent}
                      onCheckedChange={value => setConsent(Boolean(value))}
                      className="mt-0.5"
                    />
                    <span>
                      I agree to be contacted about this request. I understand I
                      can opt out at any time.
                    </span>
                  </label>
                  <Button
                    disabled={createLead.isPending || !consent}
                    className="h-11 w-full rounded-xl bg-[#17151f] text-white hover:bg-violet-600"
                  >
                    {createLead.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {createLead.isPending ? "Sending…" : "Send request"}
                  </Button>
                </CardContent>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
