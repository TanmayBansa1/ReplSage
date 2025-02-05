import React from 'react'
import { toast } from 'sonner';
import { Tabs, TabsContent } from './ui/tabs';
import { cn } from '~/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { lucario } from 'react-syntax-highlighter/dist/esm/styles/prism';
type Props = {
    fileReferences: { fileName: string, summary: string, sourceCode: string }[]
}

const CodeReferences = ({ fileReferences }: Props) => {

    const [tab, setTab] = React.useState(fileReferences[0]?.fileName);
    if (fileReferences.length === 0) {
        toast.error("No code references found")
        return <div>
            No code references found for this specific question
        </div>
    }
    return <div className='max-w-[70vw]'>
        <Tabs value={tab} onValueChange={setTab}>
            <div className='overflow-scroll flex gap-2 light:bg-gray-200 p-1 rounded-md no-scrollbar'>
                {fileReferences.map((file, index) => (
                    <button onClick={() => setTab(file.fileName)} key={index} value={file.fileName} className={cn('px-3 py-1.6 whitespace-nowrap transition-colors hover:bg-accent hover:text-accent-foreground rounded-md text-sm font-medium dark:bg-gray-800 bg-gray-200', {
                        'bg-primary text-white': tab === file.fileName
                    })}>
                        {file.fileName}
                    </button>
                ))}
            </div>
            {fileReferences.map((file, index) => {
                return <TabsContent key={index} value={file.fileName} className='overflow-scroll max-w-7xl rounded-md max-h-[40vh] no-scrollbar'>
                    <SyntaxHighlighter language="tsx" style={lucario} >

                        {file.sourceCode}
                    </SyntaxHighlighter>

                </TabsContent>
            })}
        </Tabs>
    </div>


}

export default CodeReferences