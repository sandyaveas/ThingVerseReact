import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-200 py-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-600">Module Information</CardTitle>
        </CardHeader>
        <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🚧</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-800">{title} Module</h3>
            <p className="text-slate-500 max-w-md">
              {description}
            </p>
          </div>
          <div className="text-xs text-slate-400 italic">
            This module is currently under development as part of the ThingVerse POC.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
