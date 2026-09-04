import { useMemo, useState } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Flame,
  LayoutGrid,
  Plus,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";

const STAGES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Follow-up",
  "Won",
  "Lost",
] as const;
const ACCENTS: Record<string, string> = {
  violet: "from-violet-500 to-indigo-500",
  cyan: "from-cyan-400 to-blue-500",
  amber: "from-amber-400 to-orange-500",
  rose: "from-rose-400 to-pink-500",
};

function formatHours(value = 0) {
  if (value === 0) return "—";
  if (value < 1) return `${Math.round(value * 60)}m`;
  return `${value.toFixed(1)}h`;
}

export default function Home() {
  const nichesQuery = trpc.niches.list.useQuery();
  const niches = nichesQuery.data ?? [];
  const [selectedNicheId, setSelectedNicheId] = useState<number | undefined>();
  const activeNicheId = selectedNicheId ?? niches[0]?.id;
  const activeNiche = niches.find(niche => niche.id === activeNicheId);
  const leadsQuery = trpc.leads.list.useQuery(
    { nicheId: activeNicheId! },
    { enabled: Boolean(activeNicheId) }
  );
  const metricsQuery = trpc.metrics.byNiche.useQuery(
    { nicheId: activeNicheId! },
    { enabled: Boolean(activeNicheId) }
  );
  const notificationsQuery = trpc.notifications.list.useQuery();
  const createNiche = trpc.niches.create.useMutation({
    onSuccess: () => {
      nichesQuery.refetch();
      toast.success("Niche created");
    },
    onError: error => toast.error(error.message),
  });
  const updateLead = trpc.leads.update.useMutation({
    onSuccess: () => {
      leadsQuery.refetch();
      metricsQuery.refetch();
    },
    onError: error => toast.error(error.message),
  });
  const markRead = trpc.notifications.markRead.useMutation({
    onSuccess: () => notificationsQuery.refetch(),
  });
  const saveTemplate = trpc.templates.save.useMutation({
    onSuccess: () =>
      toast.success("Niche configuration saved as a reusable template"),
    onError: error => toast.error(error.message),
  });
  const [newNicheOpen, setNewNicheOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [draggedLeadId, setDraggedLeadId] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const groupedLeads = useMemo(
    () =>
      STAGES.reduce<Record<string, typeof leadsQuery.data>>((groups, stage) => {
        groups[stage] = (leadsQuery.data ?? []).filter(
          lead => lead.stage === stage
        );
        return groups;
      }, {}),
    [leadsQuery.data]
  );
  const metrics = metricsQuery.data ?? {
    totalLeads: 0,
    proposalsSent: 0,
    followUpsTriggered: 0,
    won: 0,
    lost: 0,
    recovered: 0,
    averageResponseHours: 0,
  };
  const winRate =
    metrics.won + metrics.lost
      ? Math.round((metrics.won / (metrics.won + metrics.lost)) * 100)
      : 0;

  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-2rem)] bg-[#f7f7fb] text-[#17151f] -m-4 px-5 py-5 lg:px-8 lg:py-7">
        <header className="mx-auto max-w-[1540px]">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">
                <span className="h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_0_5px_rgba(139,92,246,0.12)]" />
                AION Acquisition Engine
              </div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Your acquisition cockpit.
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                A clear view of every opportunity, every follow-up, and every
                conversion across your service niches.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog
                open={showNotifications}
                onOpenChange={setShowNotifications}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="relative h-10 rounded-xl border-slate-200 bg-white px-3 shadow-sm"
                  >
                    <Bell className="h-4 w-4" />
                    {(notificationsQuery.data?.length ?? 0) > 0 && (
                      <span className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                        {notificationsQuery.data?.length}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Owner notifications</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    {(notificationsQuery.data ?? []).length === 0 ? (
                      <p className="py-8 text-center text-sm text-slate-500">
                        You’re all caught up.
                      </p>
                    ) : (
                      notificationsQuery.data?.map(notification => (
                        <button
                          key={notification.id}
                          onClick={() =>
                            markRead.mutate({ notificationId: notification.id })
                          }
                          className="flex w-full items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-left hover:bg-violet-50"
                        >
                          <div className="mt-0.5 rounded-lg bg-white p-2 text-violet-600 shadow-sm">
                            <Bell className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {notification.body}
                            </p>
                          </div>
                          <Check className="ml-auto h-4 w-4 text-slate-300" />
                        </button>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={newNicheOpen} onOpenChange={setNewNicheOpen}>
                <DialogTrigger asChild>
                  <Button className="h-10 rounded-xl bg-[#17151f] px-4 text-white shadow-lg shadow-slate-900/10 hover:bg-violet-600">
                    <Plus className="mr-2 h-4 w-4" />
                    New niche
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl sm:max-w-md">
                  <NicheForm
                    loading={createNiche.isPending}
                    onSubmit={values => {
                      createNiche.mutate(values);
                      setNewNicheOpen(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {niches.map(niche => (
                <button
                  key={niche.id}
                  onClick={() => setSelectedNicheId(niche.id)}
                  className={`group flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${activeNicheId === niche.id ? "border-violet-200 bg-white text-violet-700 shadow-sm" : "border-transparent text-slate-500 hover:border-slate-200 hover:bg-white"}`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${ACCENTS[niche.accent] ?? ACCENTS.violet}`}
                  />
                  {niche.name}
                  <span className="ml-1 text-xs text-slate-400">
                    {activeNicheId === niche.id ? "active" : ""}
                  </span>
                </button>
              ))}
              {niches.length === 0 && (
                <p className="text-sm text-slate-500">
                  Create your first niche to start tracking opportunities.
                </p>
              )}
            </div>
            {activeNiche && (
              <div className="flex items-center gap-2">
                <Link href={`/intake/${activeNiche.publicKey}`}>
                  <Button
                    variant="outline"
                    className="h-9 rounded-lg border-slate-200 bg-white text-xs"
                  >
                    <ArrowUpRight className="mr-2 h-3.5 w-3.5" />
                    Open intake form
                  </Button>
                </Link>
                <Link href={`/automation/${activeNiche.id}`}>
                  <Button
                    variant="ghost"
                    className="h-9 rounded-lg text-xs text-slate-500 hover:text-violet-700"
                  >
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    Automation
                  </Button>
                </Link>
                <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-9 rounded-lg text-xs text-slate-500 hover:text-violet-700"
                    >
                      <Copy className="mr-2 h-3.5 w-3.5" />
                      Save as template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl sm:max-w-md">
                    <TemplateForm
                      loading={saveTemplate.isPending}
                      onSubmit={values => {
                        saveTemplate.mutate({
                          ...values,
                          nicheId: activeNiche.id,
                        });
                        setTemplateOpen(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </header>

        {activeNiche ? (
          <main className="mx-auto mt-7 max-w-[1540px] space-y-6">
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Total leads"
                value={metrics.totalLeads}
                detail="Across this niche"
                icon={Users}
                accent="violet"
              />
              <MetricCard
                label="Avg. response time"
                value={formatHours(metrics.averageResponseHours)}
                detail="Arrival to first outreach"
                icon={Clock3}
                accent="cyan"
              />
              <MetricCard
                label="Proposal velocity"
                value={metrics.proposalsSent}
                detail={`${metrics.followUpsTriggered} follow-ups triggered`}
                icon={TrendingUp}
                accent="amber"
              />
              <MetricCard
                label="Win rate"
                value={`${winRate}%`}
                detail={`${metrics.won} won · ${metrics.lost} lost`}
                icon={Target}
                accent="rose"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
              <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-[0_20px_60px_rgba(50,40,90,0.06)]">
                <CardHeader className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-base tracking-tight">
                      Pipeline
                    </CardTitle>
                    <p className="mt-1 text-xs text-slate-400">
                      Drag a lead between stages to update its state.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full border-0 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-700">
                      {activeNiche.name}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        leadsQuery.refetch();
                        metricsQuery.refetch();
                      }}
                      className="h-8 w-8 rounded-lg text-slate-400"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="overflow-x-auto p-4">
                  <div className="grid min-w-[1100px] grid-cols-7 gap-3">
                    {STAGES.map(stage => (
                      <div
                        key={stage}
                        onDragOver={event => event.preventDefault()}
                        onDrop={() => {
                          if (draggedLeadId)
                            updateLead.mutate({ leadId: draggedLeadId, stage });
                          setDraggedLeadId(null);
                        }}
                        className="min-h-[340px] rounded-xl bg-[#f8f8fc] p-2.5"
                      >
                        <div className="mb-3 flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${stage === "Won" ? "bg-emerald-400" : stage === "Lost" ? "bg-rose-400" : stage === "Follow-up" ? "bg-amber-400" : "bg-violet-400"}`}
                            />
                            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                              {stage}
                            </p>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-300">
                            {groupedLeads[stage]?.length ?? 0}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {(groupedLeads[stage] ?? []).map(lead => (
                            <div
                              key={lead.id}
                              draggable
                              onDragStart={() => setDraggedLeadId(lead.id)}
                              className="group cursor-grab rounded-xl border border-slate-100 bg-white p-3 shadow-[0_5px_16px_rgba(30,25,70,0.04)] transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate text-sm font-semibold text-slate-800">
                                  {lead.name}
                                </p>
                                {lead.isHot && (
                                  <Flame className="h-3.5 w-3.5 shrink-0 text-orange-500" />
                                )}
                              </div>
                              <p className="mt-1 truncate text-xs text-slate-400">
                                {lead.serviceType || "Service inquiry"}
                              </p>
                              <LeadControls
                                lead={lead}
                                source={lead.source || "Direct"}
                                onUpdate={patch =>
                                  updateLead.mutate({
                                    leadId: lead.id,
                                    ...patch,
                                  })
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <aside className="space-y-4">
                <Card className="rounded-2xl border-0 bg-[#17151f] text-white shadow-[0_20px_60px_rgba(20,18,30,0.2)]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-white/10 p-2.5">
                        <Sparkles className="h-5 w-5 text-violet-300" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
                        AION signal
                      </span>
                    </div>
                    <p className="mt-7 text-2xl font-semibold tracking-[-0.04em]">
                      {metrics.recovered} recovered
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/55">
                      Opportunities currently in follow-up and ready for another
                      touch.
                    </p>
                    <Separator className="my-5 bg-white/10" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/45">Pipeline health</span>
                      <span className="font-semibold text-emerald-300">
                        {metrics.totalLeads ? "Active" : "Waiting"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-0 bg-white shadow-[0_10px_40px_rgba(50,40,90,0.05)]">
                  <CardHeader className="px-5 pb-2 pt-5">
                    <CardTitle className="text-sm">
                      Automation guardrails
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 px-5 pb-5 pt-2">
                    <Guardrail
                      label="Consent tracking"
                      status="Active"
                      icon={ShieldAlert}
                    />
                    <Guardrail
                      label="Opt-out kill switch"
                      status="Always on"
                      icon={X}
                    />
                    <Guardrail
                      label="Human escalation"
                      status="Ready"
                      icon={UserRound}
                    />
                  </CardContent>
                </Card>
              </aside>
            </section>
          </main>
        ) : (
          <EmptyState onCreate={() => setNewNicheOpen(true)} />
        )}
      </div>
    </DashboardLayout>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  detail: string;
  icon: typeof Users;
  accent: string;
}) {
  return (
    <Card className="rounded-2xl border-0 bg-white shadow-[0_12px_40px_rgba(50,40,90,0.05)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">{label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-slate-900">
              {value}
            </p>
          </div>
          <div
            className={`rounded-xl bg-gradient-to-br ${ACCENTS[accent]} p-2.5 text-white shadow-lg`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-3 text-[11px] text-slate-400">{detail}</p>
      </CardContent>
    </Card>
  );
}
function Guardrail({
  label,
  status,
  icon: Icon,
}: {
  label: string;
  status: string;
  icon: typeof ShieldAlert;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
      <Icon className="h-4 w-4 text-violet-500" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-700">{label}</p>
        <p className="mt-0.5 text-[10px] text-slate-400">{status}</p>
      </div>
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
    </div>
  );
}
function NicheForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (values: {
    name: string;
    description?: string;
    accent?: string;
  }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit({ name, description, accent: "violet" });
      }}
    >
      <DialogHeader>
        <DialogTitle>Create a new niche</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-5">
        <div>
          <Label htmlFor="niche-name">Niche name</Label>
          <Input
            id="niche-name"
            className="mt-2 rounded-xl"
            placeholder="HVAC installers"
            value={name}
            onChange={event => setName(event.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="niche-description">Description</Label>
          <Textarea
            id="niche-description"
            className="mt-2 rounded-xl"
            placeholder="What this pipeline is designed to convert"
            value={description}
            onChange={event => setDescription(event.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={loading || !name.trim()}
          className="rounded-xl bg-[#17151f]"
        >
          {loading ? "Creating…" : "Create niche"}
        </Button>
      </DialogFooter>
    </form>
  );
}
function TemplateForm({
  loading,
  onSubmit,
}: {
  loading: boolean;
  onSubmit: (values: { name: string; description?: string }) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit({ name, description });
      }}
    >
      <DialogHeader>
        <DialogTitle>Save niche template</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-5">
        <div>
          <Label htmlFor="template-name">Template name</Label>
          <Input
            id="template-name"
            className="mt-2 rounded-xl"
            placeholder="HVAC acquisition playbook"
            value={name}
            onChange={event => setName(event.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="template-description">Description</Label>
          <Textarea
            id="template-description"
            className="mt-2 rounded-xl"
            placeholder="A reusable configuration for future clients"
            value={description}
            onChange={event => setDescription(event.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          disabled={loading || !name.trim()}
          className="rounded-xl bg-[#17151f]"
        >
          {loading ? "Saving…" : "Save template"}
        </Button>
      </DialogFooter>
    </form>
  );
}
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <main className="mx-auto flex max-w-[1540px] items-center justify-center py-24">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <LayoutGrid className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
          Build your first acquisition lane.
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Create a niche to unlock its intake form, pipeline, automations, and
          conversion metrics.
        </p>
        <Button
          onClick={onCreate}
          className="mt-6 rounded-xl bg-[#17151f] px-5 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create first niche
        </Button>
      </div>
    </main>
  );
}

function LeadControls({
  lead,
  source,
  onUpdate,
}: {
  lead: { id: number; needsHumanReview: boolean; optOut: boolean };
  source: string;
  onUpdate: (patch: { needsHumanReview?: boolean; optOut?: boolean }) => void;
}) {
  return (
    <>
      <div className="mt-3 flex items-center justify-between gap-2 text-[10px] text-slate-400">
        <span className="truncate">{source}</span>
        <div className="flex shrink-0 items-center gap-1">
          <button
            title="Toggle needs human review"
            onClick={event => {
              event.stopPropagation();
              onUpdate({ needsHumanReview: !lead.needsHumanReview });
            }}
            className={`rounded-md p-1 transition ${lead.needsHumanReview ? "bg-amber-100 text-amber-700" : "text-slate-300 hover:bg-amber-50 hover:text-amber-600"}`}
          >
            <ShieldAlert className="h-3 w-3" />
          </button>
          <button
            title="Toggle opt-out"
            onClick={event => {
              event.stopPropagation();
              onUpdate({ optOut: !lead.optOut });
            }}
            className={`rounded-md p-1 transition ${lead.optOut ? "bg-rose-100 text-rose-700" : "text-slate-300 hover:bg-rose-50 hover:text-rose-600"}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
      {(lead.needsHumanReview || lead.optOut) && (
        <div className="mt-2 flex gap-1">
          {lead.needsHumanReview && (
            <Badge className="rounded-full border-0 bg-amber-50 px-1.5 py-0.5 text-[9px] text-amber-700">
              needs human review
            </Badge>
          )}
          {lead.optOut && (
            <Badge className="rounded-full border-0 bg-rose-50 px-1.5 py-0.5 text-[9px] text-rose-700">
              opted out
            </Badge>
          )}
        </div>
      )}
    </>
  );
}
