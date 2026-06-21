import { getFile } from "@/app/api/files";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const file = await getFile(params.id);
    const name = file.filename || file.file_name || params.id;
    return { title: `${name} | Shrtl://` };
  } catch {
    return { title: "Shrtl://" };
  }
}

export default function FileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
