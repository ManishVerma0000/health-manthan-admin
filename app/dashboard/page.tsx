import React from "react";
import { Users, Building2, Calendar, Activity } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your system's performance.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Hospitals"
                    value="120"
                    change="+12% from last month"
                    icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Total Doctors"
                    value="450"
                    change="+5% from last month"
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Appointments"
                    value="1,203"
                    change="+25% from last month"
                    icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Active Users"
                    value="3,405"
                    change="+8% from last month"
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
                        <p className="text-sm text-muted-foreground">Latest actions on the platform.</p>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">New appointment booked</p>
                                        <p className="text-sm text-muted-foreground">
                                            Dr. Smith • 2 minutes ago
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium text-sm text-green-600">
                                        +₹500
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">System Status</h3>
                        <p className="text-sm text-muted-foreground">Operational metrics.</p>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                            Chart Placeholder
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, change, icon }: { title: string; value: string; change: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">{title}</h3>
                {icon}
            </div>
            <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{change}</p>
            </div>
        </div>
    );
}
