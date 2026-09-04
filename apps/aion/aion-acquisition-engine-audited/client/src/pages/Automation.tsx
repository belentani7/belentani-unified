import { useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Clock3, Mail, Plus, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const STAGES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Follow-up",
  "Won",
  "Lost",
] as const;

export default function Automation() {
  const nicheId = Number(useParams<{ nicheId: string }>().nicheId);
  const niche = trpc.niches.get.useQuery(
    { nicheId },
    { enabled: Number.isFinite(nicheId) }
  );
  const config = trpc.automationConfig.get.useQuery(
    { nicheId },
    { enabled: Number.isFinite(nicheId) }
  );
  const createMessage = trpc.automationConfig.createMessage.useMutation({
    onSuccess: () => {
      config.refetch();
      toast.success("Message template added");
    },
  });
  const createRule = trpc.automationConfig.createRule.useMutation({
    onSuccess: () => {
      config.refetch();
      toast.success("Follow-up timing added");
    },
  });
  const [message, setMessage] = useState({
    name: "",
    stage: "Follow-up" as (typeof STAGES)[number],
    channel: "email" as "email" | "sms" | "whatsapp",
    subject: "",
    body: "",
  });
  const [rule, setRule] = useState({
    fromStage: "Proposal Sent" as (typeof STAGES)[number],
    delayHours: "48",
  });
  return (
    <div className="min-h-screen bg-[#f7f7fb] px-5 py-8 text-[#17151f] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 rounded-xl text-slate-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to cockpit
          </Button>
        </Link>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              Automation lane
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.05em]">
              {niche.data?.name ?? "Niche"} automation.
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Approved templates and timing rules for this acquisition lane.
            </p>
          </div>
          <Badge className="w-fit rounded-full border-0 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-700">
            <ShieldCheck className="mr-2 h-3.5 w-3.5" />
            Consent gates active
          </Badge>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="rounded-2xl border-0 bg-white shadow-[0_14px_50px_rgba(50,40,90,0.06)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-4 w-4 text-violet-500" />
                Message templates
              </CardTitle>
              <p className="text-xs leading-5 text-slate-500">
                Only approved messages can be used for follow-ups.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Template name</Label>
                <Input
                  className="mt-2 rounded-xl"
                  placeholder="48-hour check-in"
                  value={message.name}
                  onChange={event =>
                    setMessage({ ...message, name: event.target.value })
                  }
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Trigger stage</Label>
                  <Select
                    value={message.stage}
                    onValueChange={value =>
                      setMessage({
                        ...message,
                        stage: value as (typeof STAGES)[number],
                      })
                    }
                  >
                    <SelectTrigger className="mt-2 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map(stage => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Channel</Label>
                  <Select
                    value={message.channel}
                    onValueChange={value =>
                      setMessage({
                        ...message,
                        channel: value as typeof message.channel,
                      })
                    }
                  >
                    <SelectTrigger className="mt-2 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Subject</Label>
                <Input
                  className="mt-2 rounded-xl"
                  placeholder="Following up on your request"
                  value={message.subject}
                  onChange={event =>
                    setMessage({ ...message, subject: event.target.value })
                  }
                />
              </div>
              <div>
                <Label>Body</Label>
                <Textarea
                  className="mt-2 min-h-28 rounded-xl"
                  placeholder="Hi {{name}}, just checking whether…"
                  value={message.body}
                  onChange={event =>
                    setMessage({ ...message, body: event.target.value })
                  }
                />
              </div>
              <Button
                disabled={
                  createMessage.isPending || !message.name || !message.body
                }
                onClick={() => createMessage.mutate({ nicheId, ...message })}
                className="rounded-xl bg-[#17151f] text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add template
              </Button>
              <div className="space-y-2 border-t border-slate-100 pt-4">
                {(config.data?.messageTemplates ?? []).map(template => (
                  <div
                    key={template.id}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                  >
                    <Mail className="h-4 w-4 text-violet-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold">
                        {template.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {template.stage} · {template.channel}
                      </p>
                    </div>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-0 bg-white shadow-[0_14px_50px_rgba(50,40,90,0.06)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock3 className="h-4 w-4 text-amber-500" />
                Follow-up timing
              </CardTitle>
              <p className="text-xs leading-5 text-slate-500">
                Tasks are created when a lead enters a stage, then rechecked
                before any action.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>When a lead enters</Label>
                <Select
                  value={rule.fromStage}
                  onValueChange={value =>
                    setRule({
                      ...rule,
                      fromStage: value as (typeof STAGES)[number],
                    })
                  }
                >
                  <SelectTrigger className="mt-2 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map(stage => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Delay in hours</Label>
                <Input
                  type="number"
                  min="1"
                  className="mt-2 rounded-xl"
                  value={rule.delayHours}
                  onChange={event =>
                    setRule({ ...rule, delayHours: event.target.value })
                  }
                />
              </div>
              <Button
                disabled={createRule.isPending}
                onClick={() =>
                  createRule.mutate({
                    nicheId,
                    fromStage: rule.fromStage,
                    delayHours: Number(rule.delayHours),
                  })
                }
                className="rounded-xl bg-[#17151f] text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                Save timing rule
              </Button>
              <div className="space-y-2 border-t border-slate-100 pt-4">
                {(config.data?.followUpRules ?? []).map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
                  >
                    <Clock3 className="h-4 w-4 text-amber-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold">
                        {item.delayHours} hours after {item.fromStage}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {item.enabled ? "Active rule" : "Paused"}
                      </p>
                    </div>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
