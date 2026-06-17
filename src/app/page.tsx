"use client";

import { useState, useEffect, useCallback } from "react";
import { signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  Plus,
  Search,
  Trash2,
  ExternalLink,
  LogOut,
  Link2,
  Globe,
  FolderOpen,
  Edit3,
  Check,
  Copy,
  Shield,
  Mail,
  Lock,
  User,
  LayoutGrid,
  List,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Types
type View = "login" | "register" | "dashboard";

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface BookmarkData {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  favicon: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// ============== AUTH VIEWS ==============

function LoginView({ onSwitchToRegister, onLoginSuccess }: { onSwitchToRegister: () => void; onLoginSuccess: (user: UserData) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        const sessionRes = await fetch("/api/auth/session-check");
        const sessionData = await sessionRes.json();
        if (sessionData.authenticated) {
          onLoginSuccess(sessionData.user);
        } else {
          setError("Login failed. Please try again.");
        }
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200"
          >
            <Bookmark className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900">LinkVault</h1>
          <p className="text-gray-500 mt-2">Your bookmarks, one place, always safe.</p>
        </div>

        <Card className="shadow-xl border-0 shadow-gray-200/50">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
            <CardDescription>Sign in to access your bookmark collection</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100"
                >
                  {error}
                </motion.div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-200 transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <button
                  onClick={onSwitchToRegister}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                >
                  Create one
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function RegisterView({ onSwitchToLogin, onRegisterSuccess }: { onSwitchToLogin: () => void; onRegisterSuccess: (user: UserData) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Auto-login after registration
        const loginResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginResult?.ok) {
          const sessionRes = await fetch("/api/auth/session-check");
          const sessionData = await sessionRes.json();
          if (sessionData.authenticated) {
            onRegisterSuccess(sessionData.user);
          }
        } else {
          onSwitchToLogin();
        }
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200"
          >
            <Bookmark className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900">LinkVault</h1>
          <p className="text-gray-500 mt-2">Start saving your favorite links today</p>
        </div>

        <Card className="shadow-xl border-0 shadow-gray-200/50">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold">Create account</CardTitle>
            <CardDescription>Get started with your free bookmark vault</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100"
                >
                  {error}
                </motion.div>
              )}
              <div className="space-y-2">
                <Label htmlFor="reg-name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-confirm" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-200 transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ============== BOOKMARK CARD ==============

function BookmarkCard({
  bookmark,
  onDelete,
  onEdit,
}: {
  bookmark: BookmarkData;
  onDelete: (id: string) => void;
  onEdit: (bookmark: BookmarkData) => void;
}) {
  const [copied, setCopied] = useState(false);
  const domain = (() => {
    try {
      return new URL(bookmark.url).hostname;
    } catch {
      return bookmark.url;
    }
  })();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bookmark.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 border-gray-100 hover:border-emerald-200 overflow-hidden h-full">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
              {bookmark.favicon ? (
                <img
                  src={bookmark.favicon}
                  alt=""
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).parentElement!.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
                  }}
                />
              ) : (
                <Link2 className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-gray-900 truncate text-sm">
                  {bookmark.title}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => window.open(bookmark.url, "_blank")}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopy}>
                      {copied ? (
                        <Check className="h-4 w-4 mr-2 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copied ? "Copied!" : "Copy URL"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(bookmark)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(bookmark.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {domain}
              </p>
              {bookmark.description && (
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                  {bookmark.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0 h-5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100"
                >
                  {bookmark.category}
                </Badge>
                <span className="text-[10px] text-gray-300">
                  {formatDate(bookmark.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============== BOOKMARK LIST ITEM ==============

function BookmarkListItem({
  bookmark,
  onDelete,
  onEdit,
}: {
  bookmark: BookmarkData;
  onDelete: (id: string) => void;
  onEdit: (bookmark: BookmarkData) => void;
}) {
  const domain = (() => {
    try {
      return new URL(bookmark.url).hostname;
    } catch {
      return bookmark.url;
    }
  })();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
      className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
        {bookmark.favicon ? (
          <img
            src={bookmark.favicon}
            alt=""
            className="w-4 h-4 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <Link2 className="w-4 h-4 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-900 truncate">
            {bookmark.title}
          </span>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0 h-4 bg-emerald-50 text-emerald-700 border-emerald-100 shrink-0"
          >
            {bookmark.category}
          </Badge>
        </div>
        <p className="text-xs text-gray-400 truncate">{domain}</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => window.open(bookmark.url, "_blank")}
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => onEdit(bookmark)}
        >
          <Edit3 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
          onClick={() => onDelete(bookmark.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

// ============== ADD/EDIT BOOKMARK DIALOG ==============

function BookmarkFormInner({
  editingBookmark,
  onSave,
  onCancel,
  categories,
}: {
  editingBookmark: BookmarkData | null;
  onSave: (data: {
    title: string;
    url: string;
    description: string;
    category: string;
  }) => void;
  onCancel: () => void;
  categories: string[];
}) {
  const [title, setTitle] = useState(editingBookmark?.title ?? "");
  const [url, setUrl] = useState(editingBookmark?.url ?? "");
  const [description, setDescription] = useState(editingBookmark?.description ?? "");
  const [category, setCategory] = useState(editingBookmark?.category ?? "Uncategorized");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalCategory = category;
    if (showNewCategory && newCategory.trim()) {
      finalCategory = newCategory.trim();
    }
    onSave({ title, url, description, category: finalCategory });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label className="text-sm font-medium">Title</Label>
        <Input
          placeholder="My awesome website"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">URL</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="pl-10"
            required
            type="url"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Description (optional)</Label>
        <Input
          placeholder="A brief note about this link"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium">Category</Label>
        {!showNewCategory ? (
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 h-9 rounded-md border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Uncategorized">Uncategorized</option>
              {categories
                .filter((c) => c !== "Uncategorized")
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewCategory(true)}
              className="shrink-0"
            >
              New
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowNewCategory(false);
                setNewCategory("");
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
        >
          {editingBookmark ? "Save Changes" : "Add Bookmark"}
        </Button>
      </div>
    </form>
  );
}

function BookmarkFormDialog({
  open,
  onOpenChange,
  editingBookmark,
  onSave,
  categories,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBookmark: BookmarkData | null;
  onSave: (data: {
    title: string;
    url: string;
    description: string;
    category: string;
  }) => void;
  categories: string[];
}) {
  // Use key to force remount when editingBookmark changes, so form resets naturally
  const formKey = editingBookmark ? `edit-${editingBookmark.id}` : "add";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingBookmark ? "Edit Bookmark" : "Add New Bookmark"}
          </DialogTitle>
          <DialogDescription>
            {editingBookmark
              ? "Update the details of your bookmark"
              : "Save a new link to your vault"}
          </DialogDescription>
        </DialogHeader>
        <BookmarkFormInner
          key={formKey}
          editingBookmark={editingBookmark}
          onSave={onSave}
          onCancel={() => onOpenChange(false)}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
}

// ============== DASHBOARD ==============

function DashboardView({ user, onLogout }: { user: UserData; onLogout: () => void }) {
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<BookmarkData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchBookmarks = useCallback(async () => {
    try {
      const res = await fetch("/api/bookmarks");
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks);
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const categories = ["All", ...Array.from(new Set(bookmarks.map((b) => b.category)))];

  const filteredBookmarks = bookmarks.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddBookmark = async (data: {
    title: string;
    url: string;
    description: string;
    category: string;
  }) => {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        setBookmarks((prev) => [result.bookmark, ...prev]);
      }
    } catch (error) {
      console.error("Failed to add bookmark:", error);
    }
  };

  const handleEditBookmark = async (data: {
    title: string;
    url: string;
    description: string;
    category: string;
  }) => {
    if (!editingBookmark) return;
    try {
      const res = await fetch(`/api/bookmarks/${editingBookmark.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        setBookmarks((prev) =>
          prev.map((b) => (b.id === editingBookmark.id ? result.bookmark : b))
        );
        setEditingBookmark(null);
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      const res = await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
    }
    setDeleteDialogOpen(false);
    setBookmarkToDelete(null);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    onLogout();
  };

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
                <Bookmark className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">LinkVault</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  setEditingBookmark(null);
                  setDialogOpen(true);
                }}
                className="h-9 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-sm hidden sm:flex"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Link
              </Button>
              <Button
                onClick={() => {
                  setEditingBookmark(null);
                  setDialogOpen(true);
                }}
                className="h-9 w-9 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-sm sm:hidden"
                size="icon"
                aria-label="Add bookmark"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {/* Category Filter Bar */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-emerald-100 text-emerald-700 shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat === "All" ? (
                  <span className="flex items-center gap-1">
                    <FolderOpen className="h-3.5 w-3.5" />
                    All
                  </span>
                ) : (
                  cat
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Bookmarks Display */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <Bookmark className="w-10 h-10 text-emerald-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {bookmarks.length === 0 ? "No bookmarks yet" : "No matching bookmarks"}
            </h3>
            <p className="text-gray-500 max-w-sm mb-6">
              {bookmarks.length === 0
                ? "Start building your collection by adding your first bookmark"
                : "Try adjusting your search or category filter"}
            </p>
            {bookmarks.length === 0 && (
              <Button
                onClick={() => {
                  setEditingBookmark(null);
                  setDialogOpen(true);
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Bookmark
              </Button>
            )}
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={(id) => {
                    setBookmarkToDelete(id);
                    setDeleteDialogOpen(true);
                  }}
                  onEdit={(b) => {
                    setEditingBookmark(b);
                    setDialogOpen(true);
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <Card className="border-gray-100">
            <CardContent className="p-2">
              <AnimatePresence mode="popLayout">
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkListItem
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={(id) => {
                      setBookmarkToDelete(id);
                      setDeleteDialogOpen(true);
                    }}
                    onEdit={(b) => {
                      setEditingBookmark(b);
                      setDialogOpen(true);
                    }}
                  />
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        )}

        {/* Stats Footer */}
        {bookmarks.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-400">
            {filteredBookmarks.length} of {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""}
            {selectedCategory !== "All" && ` in "${selectedCategory}"`}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>LinkVault — Your personal bookmark manager</span>
            <span>{bookmarks.length} saved links</span>
          </div>
        </div>
      </footer>

      {/* Add/Edit Dialog */}
      <BookmarkFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingBookmark(null);
        }}
        editingBookmark={editingBookmark}
        onSave={editingBookmark ? handleEditBookmark : handleAddBookmark}
        categories={categories.filter((c) => c !== "All")}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bookmark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bookmark? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => bookmarkToDelete && handleDeleteBookmark(bookmarkToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============== MAIN APP ==============

export default function Home() {
  const [view, setView] = useState<View>("login");
  const [user, setUser] = useState<UserData | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session-check");
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          setView("dashboard");
        }
      } catch {
        // Not authenticated
      } finally {
        setChecking(false);
      }
    };
    checkSession();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 animate-pulse">
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          <div className="w-6 h-6 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {view === "login" && (
        <motion.div key="login" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <LoginView
            onSwitchToRegister={() => setView("register")}
            onLoginSuccess={(u) => {
              setUser(u);
              setView("dashboard");
            }}
          />
        </motion.div>
      )}
      {view === "register" && (
        <motion.div key="register" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <RegisterView
            onSwitchToLogin={() => setView("login")}
            onRegisterSuccess={(u) => {
              setUser(u);
              setView("dashboard");
            }}
          />
        </motion.div>
      )}
      {view === "dashboard" && user && (
        <motion.div key="dashboard" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <DashboardView
            user={user}
            onLogout={() => {
              setUser(null);
              setView("login");
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
