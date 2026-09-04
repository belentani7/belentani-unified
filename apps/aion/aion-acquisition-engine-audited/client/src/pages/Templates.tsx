import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Copy, LibraryBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Templates() {
  const templates = trpc.templates.list.useQuery();
  const clone = trpc.templates.clone.useMutation({
    onSuccess: () => {
      templates.refetch();
      toast.success("New niche cloned from template");
    },
    onError: error => toast.error(error.message),
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [name, setName] = useState("");
  return (
    <div className="min-h-screen bg-[#f7f7fb] px-5 py-8 text-[#17151f] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-8 rounded-xl text-slate-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to cockpit
          </Button>
        </Link>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              Reusable systems
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.05em]">
              Template library.
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Clone a proven acquisition lane for a new client or service niche.
            </p>
          </div>
          <LibraryBig className="h-8 w-8 text-violet-300" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {(templates.data ?? []).map(template => (
            <Card
              key={template.id}
              className="rounded-2xl border-0 bg-white shadow-[0_14px_50px_rgba(50,40,90,0.06)]"
            >
              <CardHeader>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <p className="text-xs text-slate-500">
                  {template.description ||
                    "Reusable pipeline, messages, and timing rules."}
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    setSelected(template.id);
                    setName("");
                  }}
                  className="rounded-xl bg-[#17151f] text-white"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Clone template
                </Button>
              </CardContent>
            </Card>
          ))}
          {(templates.data ?? []).length === 0 && (
            <Card className="rounded-2xl border-0 bg-white sm:col-span-2">
              <CardContent className="py-14 text-center text-sm text-slate-500">
                Save a niche configuration from the cockpit to make it reusable.
              </CardContent>
            </Card>
          )}
        </div>
        <Dialog
          open={selected !== null}
          onOpenChange={open => !open && setSelected(null)}
        >
          <DialogContent className="rounded-2xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Clone as a new niche</DialogTitle>
            </DialogHeader>
            <div className="py-5">
              <Label htmlFor="clone-name">New niche name</Label>
              <Input
                id="clone-name"
                className="mt-2 rounded-xl"
                placeholder="Real estate — Madrid"
                value={name}
                onChange={event => setName(event.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                disabled={!name.trim() || clone.isPending}
                onClick={() => {
                  if (selected) {
                    clone.mutate({ templateId: selected, name });
                    setSelected(null);
                  }
                }}
                className="rounded-xl bg-[#17151f] text-white"
              >
                {clone.isPending ? "Cloning…" : "Create cloned niche"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
