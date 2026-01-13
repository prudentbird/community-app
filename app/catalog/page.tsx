import { MailIcon, PhoneIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Profile Catalog",
  description: "Browse the profile catalog",
};

interface Profile {
  firstName: string;
  lastName: string;
  profileImage: string;
  email: string | null;
  phoneNumbers: string[];
  username: string;
  title: Title["id"];
}
interface Title {
  id: string;
  name: string;
}

const titles: Title[] = [
  { id: "1", name: "Software Engineer" },
  { id: "2", name: "Data Scientist" },
  { id: "3", name: "DevOps Engineer" },
  { id: "4", name: "Full Stack Developer" },
  { id: "5", name: "Product Manager" },
  { id: "6", name: "UI/UX Designer" },
  { id: "7", name: "Mobile Developer" },
  { id: "8", name: "Student" },
];

const profiles: Profile[] = [
  {
    firstName: "Amara",
    lastName: "Okafor",
    profileImage: "https://i.pravatar.cc/?img=11",
    email: "amara.okafor@email.com",
    phoneNumbers: ["+234 803 456 7890", "+234 706 123 4567"],
    username: "amara_codes",
    title: "1",
  },
  {
    firstName: "Chen",
    lastName: "Wei",
    profileImage: "https://i.pravatar.cc/?img=12",
    email: "chen.wei@email.com",
    phoneNumbers: ["+86 138 0013 8000"],
    username: "chenwei_data",
    title: "2",
  },
  {
    firstName: "Maria",
    lastName: "Rodriguez",
    profileImage: "https://i.pravatar.cc/?img=9",
    email: "maria.rodriguez@email.com",
    phoneNumbers: ["+52 55 1234 5678", "+52 81 9876 5432"],
    username: "maria_devops",
    title: "3",
  },
  {
    firstName: "Jamal",
    lastName: "Thompson",
    profileImage: "https://i.pravatar.cc/?img=4",
    email: "jamal.thompson@email.com",
    phoneNumbers: ["+1 555 234 5678"],
    username: "jamal_script",
    title: "8",
  },
  {
    firstName: "Priya",
    lastName: "Sharma",
    profileImage: "https://i.pravatar.cc/?img=5",
    email: "priya.sharma@email.com",
    phoneNumbers: ["+91 98765 43210"],
    username: "priya_pm",
    title: "5",
  },
  {
    firstName: "Fatima",
    lastName: "Al-Mansoori",
    profileImage: "https://i.pravatar.cc/?img=10",
    email: "fatima.almansoori@email.com",
    phoneNumbers: ["+971 50 123 4567", "+971 52 987 6543"],
    username: "fatima_designs",
    title: "6",
  },
];

export default function Catalog() {
  return (
    <div className="bg-[#413f3fc5] min-h-screen p-8 font-sans">
      <div className="max-w-350 mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Profile Catalog</h1>
        <p className="text-white/70 mb-10">Browse our talented professionals</p>
        {/* Profile List  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-10">
          {profiles.map((profile, idx) => {
            const title = titles.find((t) => t.id === profile.title);
            const key = `profile-card-${idx}`;
            return (
              <div
                key={key}
                className="h-100 rounded-[40px] bg-blue-500/20 backdrop-blur-2xl shadow-lg group"
              >
                <div className="h-full overflow-hidden rounded-[40px] shadow-lg text-[#413f3fc5] bg-blue-200 flex flex-col group-hover:-translate-1 transition-transform duration-100 delay-20 ease-in-out">
                  <div className="h-5/12 flex items-center justify-center">
                    <Image
                      src={profile.profileImage}
                      alt={profile.firstName}
                      width={150}
                      height={150}
                      className="rounded-full bg-zinc-500 h-35 aspect-square object-cover object-center shadow-lg"
                    />
                  </div>
                  <div className="h-7/12 rounded-t-[50px] bg-slate-50 inset-shadow-sm inset-shadow-blue-300/70 text-[#413f3f] flex flex-col gap-1 items-center p-4">
                    <p className="text-center font-semibold text-xl leading-none">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-center text-sm text-blue-300 font-medium">
                      @{profile.username}
                    </p>
                    <div className="text-center bg-blue-200/70 border border-blue-300 py-1 px-3 w-fit rounded-full text-sm font-medium text-blue-900">
                      {title?.name}
                    </div>
                    <div className="mt-5 w-full pt-4 border-t border-gray-300">
                      <div className="w-fit mx-auto space-y-3">
                        {profile.email && (
                          <div className="flex items-start gap-2">
                            <MailIcon size={18} />
                            <a
                              href={`mailto:${profile.email}`}
                              className="text-sm font-medium"
                            >
                              {profile.email}
                            </a>
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <PhoneIcon size={18} />
                          <ul className="flex-1">
                            {profile.phoneNumbers.map((phone, idx) => {
                              const key = `phone-${idx}`;
                              return (
                                <li
                                  key={key}
                                  className="text-sm mb-1 last:mb-0"
                                >
                                  <a href={`tel:${phone}`}>{phone}</a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
