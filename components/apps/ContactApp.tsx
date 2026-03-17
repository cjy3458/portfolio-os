import { Download } from "lucide-react";

const contacts = [
  {
    label: "EMAIL",
    value: "cjy34580324@gmail.com",
    href: "mailto:cjy34580324@gmail.com",
  },
  { label: "PHONE", value: "010-8507-1301", href: "tel:010-8507-1301" },
  {
    label: "GITHUB",
    value: "github.com/cjy3458",
    href: "https://github.com/cjy3458",
  },
  {
    label: "BLOG",
    value: "cjy3458.tistory.com",
    href: "https://cjy3458.tistory.com/",
  },
];

// Server Component — static content
export default function ContactApp() {
  return (
    <div className="p-8 font-mono h-full flex flex-col justify-center bg-stripes">
      <div className="bg-white border-4 border-black p-8 shadow-[6px_6px_0px_rgba(0,0,0,1)] max-w-md mx-auto w-full">
        <h2 className="text-3xl font-black uppercase mb-6 text-center border-b-4 border-black pb-4">
          Contact Me
        </h2>
        <div className="flex flex-col gap-4 font-bold text-lg">
          {contacts.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2 hover:bg-black hover:text-white px-2 transition-colors cursor-pointer"
            >
              <span>{c.label}</span>
              <span className="text-sm">{c.value}</span>
            </a>
          ))}
        </div>
        <a
          href="/resume.pdf"
          download
          className="mt-8 w-full border-2 border-black bg-black text-white font-black uppercase py-3 flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors group"
        >
          <Download
            size={20}
            className="group-hover:-translate-y-1 transition-transform"
          />
          Download Resume
        </a>
      </div>
    </div>
  );
}
