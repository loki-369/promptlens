"use client";

import { useState } from "react";
import { SmartImage as Image } from "@/components/ui/smart-image";
import { Plus, Eye, EyeOff, Trash2, ShieldCheck, Lock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { DifficultyBadge } from "@/components/ui/badge";
import { CATEGORIES, DIFFICULTIES } from "@/lib/categories";
import { getPublishedChallenges } from "@/data/challenges";
import { useAdminChallenges } from "@/lib/admin-store";
import type { Category, Difficulty } from "@/lib/types";

const EMPTY_FORM = {
  image: "",
  imageAlt: "",
  originalPrompt: "",
  category: "Photography" as Category,
  difficulty: "Medium" as Difficulty,
  tags: "",
  keywords: "",
  creator: "You",
  badPrompt: "",
};

export function AdminScreen() {
  const { challenges, hydrated, create, toggle, remove } = useAdminChallenges();
  const [form, setForm] = useState(EMPTY_FORM);
  const seedChallenges = getPublishedChallenges();

  const update = (key: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const canSubmit = form.image.trim() && form.originalPrompt.trim() && form.keywords.trim();

  const submit = (publish: boolean) => {
    const created = create({
      image: form.image.trim(),
      imageAlt: form.imageAlt.trim(),
      originalPrompt: form.originalPrompt.trim(),
      category: form.category,
      difficulty: form.difficulty,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      keywords: form.keywords.split(",").map((t) => t.trim()).filter(Boolean),
      creator: form.creator.trim() || "You",
      badPrompt: form.badPrompt.trim() || undefined,
    });
    if (publish) toggle(created.id);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-2">
        <ShieldCheck className="h-6 w-6 text-accent" />
        <h1 className="font-display text-3xl font-bold tracking-tight">Content admin</h1>
      </div>
      <p className="text-text-muted mb-10 max-w-2xl">
        Upload new challenges, tag their visual attributes for the evaluator, and publish or unpublish them.
        The seed library ships published and read-only; anything you add here is stored for this browser and
        immediately playable once published.
      </p>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <GlassCard strong className="p-6">
            <h2 className="font-display font-semibold mb-5 flex items-center gap-2">
              <Plus className="h-4 w-4 text-accent" />
              New challenge
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1.5 block">Image URL</label>
                <input
                  value={form.image}
                  onChange={update("image")}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-lg border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1.5 block">Image alt text</label>
                <input
                  value={form.imageAlt}
                  onChange={update("imageAlt")}
                  placeholder="Short visual description"
                  className="w-full rounded-lg border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1.5 block">Original prompt (hidden from players)</label>
                <textarea
                  value={form.originalPrompt}
                  onChange={update("originalPrompt")}
                  rows={3}
                  placeholder="The exact prompt that generated this image…"
                  className="w-full rounded-lg border border-border-strong bg-bg-elevated px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1.5 block">Category</label>
                  <select
                    value={form.category}
                    onChange={update("category")}
                    className="w-full rounded-lg border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1.5 block">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={update("difficulty")}
                    className="w-full rounded-lg border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d.level} value={d.level}>{d.level}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1.5 block">Tags (comma separated)</label>
                <input
                  value={form.tags}
                  onChange={update("tags")}
                  placeholder="night, portrait, moody"
                  className="w-full rounded-lg border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1.5 block">
                  Key visual elements <span className="text-text-faint font-normal">— powers the evaluator, comma separated</span>
                </label>
                <textarea
                  value={form.keywords}
                  onChange={update("keywords")}
                  rows={2}
                  placeholder="red fox, snowy field, golden hour, shallow depth of field, telephoto lens"
                  className="w-full rounded-lg border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1.5 block">Bad prompt <span className="text-text-faint font-normal">— optional, used by Fix the Prompt mode</span></label>
                <input
                  value={form.badPrompt}
                  onChange={update("badPrompt")}
                  placeholder="A fox in the snow."
                  className="w-full rounded-lg border border-border-strong bg-bg-elevated px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <Button variant="outline" className="flex-1" disabled={!canSubmit} onClick={() => submit(false)}>
                  Save Draft
                </Button>
                <Button className="flex-1" disabled={!canSubmit} onClick={() => submit(true)}>
                  Publish
                </Button>
              </div>
            </div>
          </GlassCard>

          {form.image && (
            <GlassCard className="mt-5 overflow-hidden">
              <p className="px-4 pt-4 text-xs uppercase tracking-wide text-text-faint">Preview</p>
              <div className="relative aspect-[4/3] mt-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt={form.imageAlt || "preview"} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="p-4 flex items-center gap-2">
                <DifficultyBadge difficulty={form.difficulty} />
                <span className="text-xs text-text-faint">{form.category}</span>
              </div>
            </GlassCard>
          )}
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-display font-semibold mb-4">Your challenges {hydrated && `(${challenges.length})`}</h2>
          {!hydrated || challenges.length === 0 ? (
            <GlassCard className="p-8 text-center text-sm text-text-faint mb-8">
              {hydrated ? "Nothing here yet — create your first challenge on the left." : "Loading…"}
            </GlassCard>
          ) : (
            <div className="space-y-3 mb-8">
              {challenges.map((c) => (
                <GlassCard key={c.id} className="p-4 flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-surface-2">
                    <Image src={c.image} alt={c.imageAlt} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <DifficultyBadge difficulty={c.difficulty} />
                      <span className="text-xs text-text-faint">{c.category}</span>
                    </div>
                    <p className="text-sm text-text-muted truncate">{c.originalPrompt}</p>
                  </div>
                  <button
                    onClick={() => toggle(c.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold shrink-0 ${
                      c.published ? "border-success/40 text-success bg-success-soft" : "border-border-strong text-text-faint"
                    }`}
                  >
                    {c.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    {c.published ? "Published" : "Unpublished"}
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    className="text-text-faint hover:text-danger transition-colors shrink-0"
                    aria-label="Delete challenge"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </GlassCard>
              ))}
            </div>
          )}

          <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
            <Lock className="h-4 w-4 text-text-faint" />
            Seed library ({seedChallenges.length}) <span className="text-xs font-normal text-text-faint">— read only</span>
          </h2>
          <div className="space-y-3">
            {seedChallenges.map((c) => (
              <GlassCard key={c.id} className="p-4 flex items-center gap-4 opacity-80">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-surface-2">
                  <Image src={c.image} alt={c.imageAlt} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <DifficultyBadge difficulty={c.difficulty} />
                    <span className="text-xs text-text-faint">{c.category}</span>
                    <span className="text-xs text-text-faint">#{String(c.number).padStart(3, "0")}</span>
                  </div>
                  <p className="text-sm text-text-muted truncate">{c.originalPrompt}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
