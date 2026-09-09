import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  KeyRound,
  Languages,
  Mail,
  Moon,
  Package,
  Phone,
  Save,
  Settings,
  ShieldCheck,
  Smartphone,
  Sun,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useRef, useState } from "react";

import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { useTheme } from "../context/ThemeContext";
import {
  changePassword as changePasswordApi,
  removeProfileImage as removeProfileImageApi,
  updateProfile as saveProfileApi,
} from "../services/auth.service";

const Profile = () => {
  const { theme, changeTheme } = useTheme();
  const { user: authUser } = useAuth();

  const {
    user,
    profileImage,
    updateProfileImage,
    removeProfileImage,
    updateUser,
  } = useProfile();

  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: authUser?.name || user?.name || "Saqib Mahmood",
    email: authUser?.email || user?.email || "saqib@stockflow.com",
    phone: "+92 300 1234567",
    role: authUser?.role || user?.role || "Administrator",
    joined: "January 12, 2026",
    lastActive: "Just now",
  });

  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("stockflow-settings");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getDefaultSettings();
      }
    }

    return getDefaultSettings();
  });

  const saveSettings = (updatedSettings) => {
    setSettings(updatedSettings);

    localStorage.setItem("stockflow-settings", JSON.stringify(updatedSettings));
  };

  const handleSettingChange = (key, value) => {
    saveSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      return;
    }

    try {
      const data = await saveProfileApi({
        name: editForm.name.trim(),
        email: editForm.email.trim(),
      });

      const nextUser = data.user;

      setProfile((current) => ({
        ...current,
        ...editForm,
        name: nextUser.name,
        email: nextUser.email,
        role: nextUser.role,
      }));

      updateUser(nextUser);
      setIsEditing(false);

      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile.");
    }
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordError("");
    setPasswordSuccess(false);
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must contain at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      await changePasswordApi({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordError("");
      setPasswordSuccess(true);

      toast.success("Password changed successfully.");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Unable to change password.",
      );
    }
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("profileImage", file);

      const response = await saveProfileApi(formData);

      updateProfileImage(response.user.profileImage);
      updateUser(response.user);

      setProfile((current) => ({
        ...current,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
      }));

      toast.success("Profile picture uploaded.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong while uploading the image.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveImage = async () => {
    try {
      const response = await removeProfileImageApi();

      removeProfileImage();
      updateUser(response.user);

      toast.success("Profile picture removed.");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to remove profile picture.",
      );
    }
  };

  const getInitials = (name = "") => {
    return name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-10"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
            Account Center
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Profile & Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Manage your personal information, profile picture, security and
            StockFlow preferences from one place.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />

          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Account Active
          </span>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="relative h-40 overflow-hidden bg-gradient-to-r from-violet-700 via-indigo-700 to-blue-700">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_35%)]" />
        </div>

        <div className="relative px-6 pb-7 sm:px-8">
          <div className="-mt-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="group relative">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-violet-500 to-indigo-600 text-3xl font-bold text-white shadow-2xl dark:border-slate-900"
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      className="h-full w-full object-cover"
                      src="https://imgs.search.brave.com/oNiMJxlgsMM0grkb92UQtUYIDQA-Cy14KUfTZq2xCFQ/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGlnaC9w/bGFjZWhvbGRlci1w/cm9maWxlLXNpbGhv/dWV0dGUtZHAzbzg2/a3UwaXMyNjYzaS5q/cGc"
                    />
                  )}

                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    </div>
                  )}
                </motion.div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl border-4 border-white bg-violet-600 text-white shadow-lg transition hover:scale-105 hover:bg-violet-700 dark:border-slate-900"
                  title="Change profile picture"
                >
                  <ImagePlus size={17} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              <div className="pb-1">
                <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
                  {profile.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {profile.email}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                    <ShieldCheck size={13} />
                    {profile.role}
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 dark:shadow-violet-950/30"
              >
                <Upload size={16} />
                {profileImage ? "Change Picture" : "Upload Picture"}
              </button>

              {profileImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/20 dark:bg-slate-950 dark:text-rose-400 dark:hover:bg-rose-500/10"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400">
            <span>JPG, PNG or WEBP · Max 5MB</span>

            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />

            <span>Last active {profile.lastActive}</span>
          </div>
        </div>
      </motion.section>

      {/* TABS */}
      <div className="flex overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <TabButton
          active={activeTab === "profile"}
          icon={User}
          label="Profile"
          onClick={() => setActiveTab("profile")}
        />

        <TabButton
          active={activeTab === "settings"}
          icon={Settings}
          label="Settings"
          onClick={() => setActiveTab("settings")}
        />

        <TabButton
          active={activeTab === "security"}
          icon={ShieldCheck}
          label="Security"
          onClick={() => setActiveTab("security")}
        />
      </div>

      <AnimatePresence mode="wait">
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-8"
          >
            {/* PERSONAL INFORMATION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <SectionHeader
                icon={User}
                title="Personal Information"
                description="Your basic account information."
              />

              {!isEditing ? (
                <div className="grid gap-5 pt-6 md:grid-cols-2">
                  <InfoItem
                    icon={User}
                    label="Full Name"
                    value={profile.name}
                  />

                  <InfoItem
                    icon={Mail}
                    label="Email Address"
                    value={profile.email}
                  />

                  <InfoItem
                    icon={Phone}
                    label="Phone Number"
                    value={profile.phone}
                  />

                  <InfoItem
                    icon={ShieldCheck}
                    label="Account Role"
                    value={profile.role}
                  />

                  <InfoItem
                    icon={CalendarDays}
                    label="Joined"
                    value={profile.joined}
                  />

                  <InfoItem
                    icon={Check}
                    label="Account Status"
                    value="Active"
                  />
                </div>
              ) : (
                <div className="pt-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <InputField
                      label="Full Name"
                      name="name"
                      value={editForm.name}
                      onChange={handleEditChange}
                    />

                    <InputField
                      label="Email Address"
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                    />

                    <InputField
                      label="Phone Number"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditChange}
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {!isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setEditForm({
                        name: profile.name,
                        email: profile.email,
                        phone: profile.phone,
                      });

                      setIsEditing(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-violet-500/40 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                </div>
              )}
            </section>

            {/* PROFILE PICTURE CARD */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <SectionHeader
                icon={ImagePlus}
                title="Profile Picture"
                description="Choose a professional image for your StockFlow account."
              />

              <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-xl font-bold text-white">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(profile.name)
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Your profile image
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    This picture will appear in your dashboard navbar, sidebar
                    and profile page.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  <ImagePlus size={16} />
                  Choose Image
                </button>
              </div>
            </section>
          </motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-8"
          >
            {/* APPEARANCE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <SectionHeader
                icon={Eye}
                title="Appearance"
                description="Customize the visual experience of StockFlow."
              />

              <div className="pt-6">
                <p className="mb-4 text-sm font-bold text-slate-700 dark:text-slate-200">
                  Theme
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <ThemeOption
                    active={theme === "light"}
                    icon={Sun}
                    title="Light"
                    description="Clean and bright interface."
                    onClick={() => changeTheme("light")}
                  />

                  <ThemeOption
                    active={theme === "dark"}
                    icon={Moon}
                    title="Dark"
                    description="Comfortable dark interface."
                    onClick={() => changeTheme("dark")}
                  />
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                <SettingToggle
                  icon={Settings}
                  title="Compact Dashboard"
                  description="Use smaller spacing and denser dashboard cards."
                  checked={settings.compactMode}
                  onChange={(value) =>
                    handleSettingChange("compactMode", value)
                  }
                />
              </div>
            </section>

            {/* NOTIFICATIONS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <SectionHeader
                icon={Bell}
                title="Notifications"
                description="Choose which StockFlow notifications you want to receive."
              />

              <div className="divide-y divide-slate-100 pt-3 dark:divide-slate-800">
                <SettingToggle
                  icon={Mail}
                  title="Email Notifications"
                  description="Receive important account and business updates."
                  checked={settings.emailNotifications}
                  onChange={(value) =>
                    handleSettingChange("emailNotifications", value)
                  }
                />

                <SettingToggle
                  icon={Package}
                  title="Low Stock Alerts"
                  description="Get notified when products reach minimum stock."
                  checked={settings.lowStockAlerts}
                  onChange={(value) =>
                    handleSettingChange("lowStockAlerts", value)
                  }
                />

                <SettingToggle
                  icon={Bell}
                  title="Order Notifications"
                  description="Receive notifications about new and completed orders."
                  checked={settings.orderNotifications}
                  onChange={(value) =>
                    handleSettingChange("orderNotifications", value)
                  }
                />
              </div>
            </section>

            {/* REGIONAL SETTINGS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <SectionHeader
                icon={Languages}
                title="Regional Preferences"
                description="Customize language and date display preferences."
              />

              <div className="grid gap-5 pt-6 md:grid-cols-2">
                <SelectField
                  icon={Languages}
                  label="Language"
                  value={settings.language}
                  onChange={(value) => handleSettingChange("language", value)}
                  options={[
                    {
                      value: "English",
                      label: "English",
                    },
                    {
                      value: "Urdu",
                      label: "Urdu",
                    },
                  ]}
                />

                <SelectField
                  icon={CalendarDays}
                  label="Date Format"
                  value={settings.dateFormat}
                  onChange={(value) => handleSettingChange("dateFormat", value)}
                  options={[
                    {
                      value: "DD/MM/YYYY",
                      label: "DD/MM/YYYY",
                    },
                    {
                      value: "MM/DD/YYYY",
                      label: "MM/DD/YYYY",
                    },
                    {
                      value: "YYYY-MM-DD",
                      label: "YYYY-MM-DD",
                    },
                  ]}
                />
              </div>
            </section>

            {/* DEVICE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <SectionHeader
                icon={Smartphone}
                title="Device Preferences"
                description="Manage preferences related to your current device."
              />

              <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <Smartphone size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                      This device is trusted
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-700/70 dark:text-emerald-400/70">
                      StockFlow recognizes this browser as your current active
                      device.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="space-y-8"
          >
            {/* PASSWORD */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <SectionHeader
                icon={KeyRound}
                title="Password"
                description="Keep your StockFlow account secure with a strong password."
              />

              <form onSubmit={handlePasswordSubmit} className="max-w-2xl pt-6">
                <div className="space-y-5">
                  <PasswordField
                    label="Current Password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />

                  <PasswordField
                    label="New Password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />

                  <PasswordField
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                  />
                </div>

                {passwordError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
                  >
                    {passwordError}
                  </motion.div>
                )}

                {passwordSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
                  >
                    <Check size={16} />
                    Password updated successfully.
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  <KeyRound size={16} />
                  Update Password
                </button>
              </form>
            </section>

            {/* TWO FACTOR */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <SectionHeader
                icon={ShieldCheck}
                title="Two-Factor Authentication"
                description="Add an extra layer of security to your account."
              />

              <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <ShieldCheck size={21} />
                </div>

                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    Two-factor authentication
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Protect your account with an additional verification step.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleSettingChange("twoFactor", !settings.twoFactor)
                  }
                  className={`relative h-7 w-12 rounded-full transition ${
                    settings.twoFactor
                      ? "bg-violet-600"
                      : "bg-slate-300 dark:bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      settings.twoFactor ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </section>

            {/* SECURITY STATUS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <SectionHeader
                icon={ShieldCheck}
                title="Security Status"
                description="A quick overview of your account security."
              />

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <SecurityCard
                  title="Password"
                  value="Protected"
                  status="Good"
                />

                <SecurityCard title="Account" value="Active" status="Good" />

                <SecurityCard
                  title="2FA"
                  value={settings.twoFactor ? "Enabled" : "Not enabled"}
                  status={settings.twoFactor ? "Good" : "Recommended"}
                  warning={!settings.twoFactor}
                />
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ---------------- HELPERS ---------------- */

function getDefaultSettings() {
  return {
    compactMode: false,
    emailNotifications: true,
    lowStockAlerts: true,
    orderNotifications: true,
    language: "English",
    dateFormat: "DD/MM/YYYY",
    twoFactor: false,
  };
}

const TabButton = ({ active, icon: Icon, label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-fit items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-violet-950/30"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      }`}
    >
      <Icon size={17} />
      {label}
    </button>
  );
};

const SectionHeader = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
        <Icon size={19} />
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => {
  return (
    <motion.div
      whileHover={{ x: 3 }}
      className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm dark:bg-slate-800 dark:text-violet-400">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
          {value}
        </p>
      </div>
    </motion.div>
  );
};

const InputField = ({ label, name, value, onChange, type = "text" }) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950"
      />
    </div>
  );
};

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  showPassword,
  setShowPassword,
}) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
};

const ThemeOption = ({ active, icon: Icon, title, description, onClick }) => {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all ${
        active
          ? "border-violet-500 bg-violet-50/70 shadow-md shadow-violet-100 dark:bg-violet-500/10 dark:shadow-violet-950/20"
          : "border-slate-200 bg-white hover:border-violet-200 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-violet-500/40"
      }`}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          active
            ? "bg-violet-600 text-white"
            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        }`}
      >
        <Icon size={21} />
      </div>

      <div className="min-w-0">
        <p className="font-bold text-slate-900 dark:text-white">{title}</p>

        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>

      {active && (
        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white">
          <Check size={14} />
        </div>
      )}
    </motion.button>
  );
};

const SettingToggle = ({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center gap-4 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-violet-600" : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

const SelectField = ({ icon: Icon, label, value, onChange, options }) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-11 text-sm font-medium text-slate-800 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronRight
          size={17}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400"
        />
      </div>
    </div>
  );
};

const SecurityCard = ({ title, value, status, warning = false }) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-950/40">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
          {title}
        </p>

        <span
          className={`h-2 w-2 rounded-full ${
            warning ? "bg-amber-500" : "bg-emerald-500"
          }`}
        />
      </div>

      <p className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
        {value}
      </p>

      <p
        className={`mt-1 text-xs font-semibold ${
          warning
            ? "text-amber-600 dark:text-amber-400"
            : "text-emerald-600 dark:text-emerald-400"
        }`}
      >
        {status}
      </p>
    </div>
  );
};

export default Profile;
