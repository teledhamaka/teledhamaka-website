import { FaWifi } from 'react-icons/fa'; // Only import used icons

interface BlogContentProps {
  content: Array<{
    type: string;
    text?: string;
    title?: string;
    icon?: string;
    content?: string;
    items?: string[];
    subsections?: Array<{
      title: string;
      content?: string;
      items?: string[];
    }>;
    headers?: string[];
    rows?: string[][];
  }>;
}

export default function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="prose max-w-none">
      {content.map((section, index) => {
        switch (section.type) {
          case 'paragraph':
            return <p key={index} className="mb-4">{section.text}</p>;
            
          case 'header':
            return <h2 key={index} className="text-2xl font-semibold text-blue-700 mb-4">{section.text}</h2>;
            
          case 'section':
            return (
              <section key={index} className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  {section.icon === 'wifi' && <FaWifi className="mr-2 text-blue-600" />}
                  {section.title}
                </h3>
                {section.content && <p className="mb-4">{section.content}</p>}
                {section.items && (
                  <ul className="list-disc pl-6 mb-4">
                    {section.items.map((item, i) => (
                      <li key={i} className="mb-2">{item}</li>
                    ))}
                  </ul>
                )}
                {section.subsections && section.subsections.map((sub, i) => (
                  <div key={i} className="mb-6 pl-4 border-l-2 border-blue-200">
                    <h4 className="text-lg font-medium mb-2">{sub.title}</h4>
                    {sub.content && <p className="mb-3">{sub.content}</p>}
                    {sub.items && (
                      <ul className="list-disc pl-6">
                        {sub.items.map((item, j) => (
                          <li key={j} className="mb-2">{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            );
            
          case 'table':
            return (
              <div key={index} className="mb-8">
                <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        {section.headers?.map((header, i) => (
                          <th key={i} className="py-3 px-4 text-left">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {section.rows?.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-blue-50' : ''}>
                          {row.map((cell, j) => (
                            <td key={j} className="py-3 px-4">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
            
          case 'disclaimer':
            return (
              <div key={index} className="mt-8 pt-6 border-t">
                <p className="text-sm text-gray-600">{section.text}</p>
              </div>
            );
            
          default:
            return null;
        }
      })}
    </div>
  );
}