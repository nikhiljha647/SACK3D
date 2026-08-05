# Icon Replacement Script
# Replaces common SVG patterns with lucide-react icons

$replacements = @(
    # Upload icons
    @{
        Pattern = '<svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/>\s*</svg>'
        Replace = '<UploadCloud className="w-8 h-8 text-gray-400" strokeWidth={1.5} />'
    },
    # Spinner/Loader
    @{
        Pattern = '<svg className="animate-spin w-\d+ h-\d+" fill="none" viewBox="0 0 24 24">\s*<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="\d+"/>\s*<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5\.373 0 0 5\.373 0 12h4z"/>\s*</svg>'
        Replace = '<Loader2 className="animate-spin w-4 h-4" strokeWidth={2} />'
    },
    # Plus icon
    @{
        Pattern = '<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" d="M12 4\.5v15m7\.5-7\.5h-15" />\s*</svg>'
        Replace = '<Plus className="w-4 h-4" strokeWidth={2} />'
    },
    # Check icon
    @{
        Pattern = '<svg className="w-(\d+) h-(\d+)" fill="none" stroke="currentColor" strokeWidth={2\.5} viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" d="m4\.5 12\.75 6 6 9-13\.5" />\s*</svg>'
        Replace = '<Check className="w-$1 h-$2" strokeWidth={2.5} />'
    },
    # Alert Triangle
    @{
        Pattern = '<svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2\.5} viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3\.75m-9\.303 3\.376c-\.866 1\.5\.217 3\.374 1\.948 3\.374h14\.71c1\.73 0 2\.813-1\.874 1\.948-3\.374L13\.949 3\.378c-\.866-1\.5-3\.032-1\.5-3\.898 0L2\.697 16\.126zM12 15\.75h\.007v\.008H12v-\.008z" />\s*</svg>'
        Replace = '<AlertTriangle className="w-6 h-6" strokeWidth={2.5} />'
    },
    # Alert Circle (info)
    @{
        Pattern = '<svg className="w-4 h-4 mt-0\.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h\.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />\s*</svg>'
        Replace = '<AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={2} />'
    },
    # Back arrow
    @{
        Pattern = '<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>\s*</svg>'
        Replace = '<ArrowLeft className="w-4 h-4" strokeWidth={2} />'
    },
    # X close icon  
    @{
        Pattern = '<svg className="w-(\d+) h-(\d+)" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>\s*</svg>'
        Replace = '<X className="w-$1 h-$2" strokeWidth={2} />'
    },
    # Download icon
    @{
        Pattern = '<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" d="M3 16\.5v2\.25A2\.25 2\.25 0 0 0 5\.25 21h13\.5A2\.25 2\.25 0 0 0 21 18\.75V16\.5M16\.5 12 12 16\.5m0 0L7\.5 12m4\.5 4\.5V3"/>\s*</svg>'
        Replace = '<Download className="w-4 h-4" strokeWidth={2} />'
    },
    # Share icon
    @{
        Pattern = '<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" d="M7\.217 10\.907a2\.25 2\.25 0 100 2\.186m0-2\.186l5\.577-3\.253m-5\.577 6\.136l5\.577 3\.253m-\.004-9\.39a2\.25 2\.25 0 100 2\.186m-\.004-2\.186l-5\.577 3\.253m5\.577 6\.136l-5\.577-3\.253m0 0a2\.25 2\.25 0 100 2\.186z" />\s*</svg>'
        Replace = '<Share2 className="w-4 h-4" strokeWidth={2} />'
    },
    # Trash/Delete icon
    @{
        Pattern = '<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" d="m14\.74 9-\.346 9m-4\.788 0L9\.26 9m9\.968-3\.21c\.342\.052\.682\.107 1\.022\.166m-1\.022-\.165L18\.16 19\.673a2\.25 2\.25 0 0 1-2\.244 2\.077H8\.084a2\.25 2\.25 0 0 1-2\.244-2\.077L4\.772 5\.79m14\.456 0a48\.108 48\.108 0 0 0-3\.478-\.397m-12 \.562c\.34-\.059\.68-\.114 1\.022-\.165m0 0a48\.11 48\.11 0 0 1 3\.478-\.397m7\.5 0v-\.916c0-1\.18-\.91-2\.164-2\.09-2\.201a51\.964 51\.964 0 0 0-3\.32 0c-1\.18\.037-2\.09 1\.022-2\.09 2\.201v\.916m7\.5 0a48\.667 48\.667 0 0 0-7\.5 0"/>\s*</svg>'
        Replace = '<Trash2 className="w-4 h-4" strokeWidth={2} />'
    },
    # Eye icon (visibility)
    @{
        Pattern = '<svg className="w-3\.5 h-3\.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />\s*<path strokeLinecap="round" strokeLinejoin="round" d="M2\.458 12C3\.732 7\.943 7\.523 5 12 5c4\.478 0 8\.268 2\.943 9\.542 7-1\.274 4\.057-5\.064 7-9\.542 7-4\.477 0-8\.268-2\.943-9\.542-7z" />\s*</svg>'
        Replace = '<Eye className="w-3.5 h-3.5" strokeWidth={2} />'
    },
    # Expand icon
    @{
        Pattern = '<svg className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0\.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" d="M3\.75 3\.75v4\.5m0-4\.5h4\.5m-4\.5 0L9 9M3\.75 20\.25v-4\.5m0 4\.5h4\.5m-4\.5 0L9 15M20\.25 3\.75h-4\.5m4\.5 0v4\.5m0-4\.5L15 9m5\.25 11\.25h-4\.5m4\.5 0v-4\.5m0 4\.5L15 15"/>\s*</svg>'
        Replace = '<Expand className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" strokeWidth={2} />'
    },
    # Box/3D icon
    @{
        Pattern = '<svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" strokeWidth={0\.75} viewBox="0 0 24 24">\s*<path strokeLinecap="round" strokeLinejoin="round" d="M21 7\.5l-9-5\.25L3 7\.5m18 0l-9 5\.25m9-5\.25v9l-9 5\.25M3 7\.5l9 5\.25M3 7\.5v9l9 5\.25m0-9v9" />\s*</svg>'
        Replace = '<Box className="w-16 h-16 text-gray-300" strokeWidth={0.75} />'
    }
)

$files = @(
    'src/pages/UploadPage.tsx',
    'src/pages/ResetPasswordPage.tsx',
    'src/pages/MyModelsPage.tsx',
    'src/pages/ModelDetailPage.tsx',
    'src/pages/DashboardPage.tsx',
    'src/components/gallery/GalleryPage.tsx',
    'src/components/gallery/UploadModal.tsx',
    'src/components/auth/LoginForm.tsx'
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $changed = $false
        
        foreach ($r in $replacements) {
            if ($content -match $r.Pattern) {
                $content = $content -replace $r.Pattern, $r.Replace
                $changed = $true
            }
        }
        
        if ($changed) {
            Set-Content $file $content -NoNewline
            Write-Host "✅ Updated: $file"
        }
    }
}

Write-Host "`n✨ Icon replacement complete!"
