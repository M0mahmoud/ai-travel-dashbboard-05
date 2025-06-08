import { Header } from "components";
import { getAllUsers } from "~/appwrite/user";
import type { Route } from "./+types/AllUsers";
import {
  ColumnsDirective,
  ColumnDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "lib/utils";

export const loader = async () => {
  const { users, total } = await getAllUsers(20, 0);
  return {
    users,
    total,
  };
};

export default function AllUsers({ loaderData }: Route.ComponentProps) {
  const { users, total } = loaderData;
  console.log("🚀 ~ AllUsers ~ users:", users);

  if (!users || users.length === 0) {
    return (
      <main className="dashboard wrapper">
        <Header title="All Users" description="No users found" />
        <p>No users available in the system.</p>
      </main>
    );
  }
  return (
    <main className="dashboard wrapper">
      <Header title="All Users" description="Manage all users in the system" />

      <GridComponent dataSource={users} gridLines="None">
        <ColumnsDirective>
          <ColumnDirective
            field="name"
            headerText="Name"
            width="200"
            textAlign="Left"
            template={(props: UserData) => (
              <div className="flex items-center gap-1.5 px-4">
                <img
                  src={props.image_url}
                  alt="user"
                  className="rounded-full size-8 aspect-square"
                  referrerPolicy="no-referrer"
                />
                <span>{props.name}</span>
              </div>
            )}
          />
          <ColumnDirective
            field="email"
            headerText="Email Address"
            width="200"
            textAlign="Left"
          />
          <ColumnDirective
            field="joinedAt"
            headerText="Date Joined"
            width="140"
            textAlign="Left"
            template={({ $createdAt }: { $createdAt: string }) =>
              formatDate($createdAt)
            }
          />
          <ColumnDirective
            field="trips"
            headerText="Trip Count"
            width="80"
            textAlign="Left"
            template={() => <span className="text-center">{60}</span>}
          />
          <ColumnDirective
            field="status"
            headerText="Type"
            width="100"
            textAlign="Left"
            template={({ role }: UserData) => (
              <article
                className={cn(
                  "status-column",
                  role === "USER" ? "bg-success-50" : "bg-light-300"
                )}
              >
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    role === "USER" ? "bg-success-500" : "bg-gray-500"
                  )}
                />
                <h3
                  className={cn(
                    "font-inter text-xs font-medium",
                    role === "USER" ? "text-success-700" : "text-gray-500"
                  )}
                >
                  {role === "USER" ? "User" : "Admin"}
                </h3>
              </article>
            )}
          />
        </ColumnsDirective>
      </GridComponent>
    </main>
  );
}
