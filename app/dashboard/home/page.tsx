import { Briefcase, Folder, Sparkles } from "lucide-react";
import Link from "next/link";
import StatCard from "~/components/dashboard/home/StatCard";
import WorkItem from "~/components/dashboard/home/WorkItem";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-blue-500/20 text-blue-300 border border-white/10">
        <CardContent className="flex items-center gap-4 pt-6">
          <Avatar className="h-14 w-14">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback className="bg-blue-500/20 text-blue-300">
              JD
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <p className="text-lg font-semibold text-white">John Doe</p>
            <p className="text-sm text-white/60">Frontend Engineer</p>

            <div className="mt-2">
              <Progress
                value={70}
                className="h-2 bg-blue-500/30 text-blue-300"
              />
              <p className="text-xs text-white/50 mt-1">Profile 70% complete</p>
            </div>
          </div>

          <Link href={"/dashboard/profile"}>
            <Button
              size="sm"
              className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 cursor-pointer"
            >
              Complete profile
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Briefcase className="h-5 w-5 text-blue-300" />}
          label="Work Experience"
          value="3"
        />
        <StatCard
          icon={<Folder className="h-5 w-5 text-blue-300" />}
          label="Projects"
          value="5"
        />
        <StatCard
          icon={<Sparkles className="h-5 w-5 text-blue-300" />}
          label="Interests"
          value="7"
        />
        <StatCard label="Profile Views" value="—" />
      </div>

      <div>
        <Card className="bg-blue-500/20 text-blue-300 border border-white/10">
          <CardHeader>
            <CardTitle className="text-base text-white">
              Recent Work Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <WorkItem
              position="Frontend Engineer"
              company="Wigxel"
              timeline="2023 — Present"
            />
            <WorkItem
              position="UI Engineer"
              company="Startup X"
              timeline="2022 — 2023"
            />

            <Link href={"/dashboard/profile"}>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-300 hover:bg-blue-500/20 cursor-pointer"
              >
                View full profile →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
