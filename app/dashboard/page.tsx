"use client";

import React, { useEffect, useState } from "react";
import { Users, Building2, Activity, Phone } from "lucide-react";
import { getHospitalList } from "@/services/hospital.service";
import { getDoctorList } from "@/services/doctor.service";
import { getSurgeryListApi } from "@/services/surgery.service";
import { getContactListApi } from "@/services/contact.service";
import { getBookAppointmentListApi } from "@/services/bookAppointment.service";
import Header from "@/components/Header";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        hospitals: 0,
        doctors: 0,
        surgeries: 0,
        contacts: 0,
    });
    const [search, setSearch] = useState('')
    const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
    const [recentContacts, setRecentContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    hospitalsRes,
                    doctorsRes,
                    surgeriesRes,
                    contactsRes,
                    appointmentsRes
                ] = await Promise.all([
                    getHospitalList(),
                    getDoctorList(),
                    getSurgeryListApi(),
                    getContactListApi({ limit: 5 }),
                    getBookAppointmentListApi({ limit: 5 })
                ]);

                // Contacts response handling
                const contactsData = contactsRes?.data?.docs || contactsRes?.data || [];
                const totalContacts = contactsRes?.data?.totalDocs || contactsData.length || 0;

                setStats({
                    hospitals: hospitalsRes?.data?.length || 0,
                    doctors: doctorsRes?.data?.length || 0,
                    surgeries: surgeriesRes?.data?.length || 0,
                    contacts: totalContacts,
                });

                setRecentContacts(contactsData.slice(0, 5));
                setRecentAppointments(appointmentsRes?.data?.docs || appointmentsRes?.data || []);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    return (
        <div className="p-2 space-y-8">
            <Header
                searchValue={search}
                onSearchChange={(value) => setSearch(value)}
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Hospitals"
                    value={stats.hospitals.toString()}
                    icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Total Doctors"
                    value={stats.doctors.toString()}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Total Surgeries"
                    value={stats.surgeries.toString()}
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCard
                    title="Contact Us Messages"
                    value={stats.contacts.toString()}
                    icon={<Phone className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Appointments</h3>
                        <p className="text-sm text-muted-foreground">Latest appointments booked on the platform.</p>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-4">
                            {recentAppointments.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No recent appointments.</p>
                            ) : (
                                recentAppointments.map((apt: any, i: number) => (
                                    <div key={i} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{apt?.name || "Unknown Patient"}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {apt?.phoneNumber} • {new Date(apt?.createdAt || Date.now()).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {/* <div className="ml-auto font-medium text-sm text-green-600">
                                            Confirmed
                                        </div> */}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">Recent Inquiries</h3>
                        <p className="text-sm text-muted-foreground">Latest contact us messages.</p>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-4">
                            {recentContacts.length === 0 ? (
                                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                                    No inquiries found.
                                </div>
                            ) : (
                                recentContacts.map((contact: any, i: number) => (
                                    <div key={i} className="flex flex-col space-y-1 border-b pb-2 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-medium leading-none">{contact?.name || "Unknown"}</p>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(contact?.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {contact?.message || "No message"}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">{title}</h3>
                {icon}
            </div>
            <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{value}</div>
                {/* <p className="text-xs text-muted-foreground">{change}</p> */}
            </div>
        </div>
    );
}
