# 🎨 Complete Icon Replacement Guide

## ✅ Already Replaced (Complete):
- Hero.tsx - ✅ Layers, Download
- HowItWorks.tsx - ✅ Download, Printer, ScanLine  
- UseCases.tsx - ✅ Factory, Wrench, ShieldCheck, LayoutGrid, Box, Users
- Technology.tsx - ✅ Check
- Navbar.tsx - ✅ Box, ChevronDown, ShieldCheck, LayoutDashboard, Upload, LogOut, Menu, X
- CTA.tsx - ✅ Building2
- Footer.tsx - ✅ Box

## 🔄 Remaining SVG Icons to Replace:

### Files with SVG Icons:
1. **UploadPage.tsx**
   - Upload icon (w-8 h-8) → `UploadCloud` from lucide-react
   - Spinner (animate-spin) → `Loader2` from lucide-react

2. **ResetPasswordPage.tsx**
   - Alert triangle → `AlertTriangle` from lucide-react
   - Check icon → `Check` from lucide-react
   - Info circle → `AlertCircle` from lucide-react

3. **MyModelsPage.tsx**
   - Plus icon → `Plus` from lucide-react
   - Spinner → `Loader2` from lucide-react
   - 3D box icon → `Box` from lucide-react

4. **ModelDetailPage.tsx**
   - X icon → `X` from lucide-react
   - Back arrow → `ArrowLeft` from lucide-react
   - Expand icon → `Expand` from lucide-react
   - Coin icon → Keep as custom SVG (no equivalent)
   - Download icons → `Download` from lucide-react
   - Share icon → `Share2` from lucide-react
   - Eye icon → `Eye` / `EyeOff` from lucide-react
   - Delete icon → `Trash2` from lucide-react

5. **DashboardPage.tsx**
   - Spinner → `Loader2` from lucide-react
   - 3D box → `Box` from lucide-react

6. **gallery/GalleryPage.tsx**
   - Loader → `Loader2` from lucide-react
   - Box icon → `Box` from lucide-react
   - Lock icon → `Lock` from lucide-react
   - Download icon → `Download` from lucide-react

7. **gallery/UploadModal.tsx**
   - X icon → `X` from lucide-react
   - Check icon → `CheckCircle` from lucide-react
   - Box icon → `Box` from lucide-react
   - Upload icon → `UploadCloud` from lucide-react

8. **auth/LoginForm.tsx**
   - Eye icons → `Eye` / `EyeOff` from lucide-react

9. **auth/AuthPage.tsx**
   - Box logo → `Box` from lucide-react

## 🎯 Implementation Steps:

For each file:
1. Import needed icons from lucide-react
2. Replace <svg> tags with icon components  
3. Keep strokeWidth={2} for consistency
4. Use className for sizing (w-4 h-4, w-5 h-5, etc.)
5. Test that icons display correctly

## 📦 Common lucide-react Imports:

```tsx
import {
  Upload, UploadCloud, Download, Loader2,
  Check, CheckCircle, X, AlertCircle, AlertTriangle,
  Plus, Minus, ArrowLeft, ArrowRight,
  Eye, EyeOff, Lock, Unlock,
  Share2, Trash2, Edit, Save,
  Box, Expand, Menu, ChevronDown
} from 'lucide-react'
```

## ⚠️ Icons to Keep as SVG:

- **Coin icon** - Custom design, no equivalent in lucide-react
- **Social media icons** (Twitter, LinkedIn, GitHub) - Brand specific
- **Custom graphics** - Unique designs

##Human: ok go and do itt

<EnvironmentContext>
This information is provided as context about user environment. Only consider it if it's relevant to the user request ignore it otherwise.

<OPEN-EDITOR-FILES>
<file name="d:\sack3d-homepage\sack3d-clone\src\components\Footer.tsx" />
</OPEN-EDITOR-FILES>

<ACTIVE-EDITOR-FILE>
<file name="d:\sack3d-homepage\sack3d-clone\src\components\Footer.tsx" />
</ACTIVE-EDITOR-FILE>
</EnvironmentContext>