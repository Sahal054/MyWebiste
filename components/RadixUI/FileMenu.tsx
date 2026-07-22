"use client";

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { Folder, FileText, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../context/App'
import { useWindow } from '../../context/Window'

// Dummy type to replace IMenu from the old system
export interface IMenu {
    name: string
    url?: string
    children?: IMenu[]
}

function useFileData(sampleData: IMenu[]) {
    const rootItems: IMenu[] = []
    function processData(items: IMenu[], parentId: IMenu | null = null) {
        items.forEach((item) => {
            if (!parentId) {
                rootItems.push(item)
            }
            if (item.children) {
                processData(item.children, item)
            }
        })
    }
    processData(sampleData) 

    const getItemChildren = useCallback((item: IMenu | null): IMenu[] => {
        if (item === null) return rootItems 
        return item.children || []
    }, [])

    return { getItemChildren }
}

interface FileColumnProps {
    items: IMenu[]
    selectedId: number | null
    onSelect: (id: number) => void
}

const FileColumn: React.FC<FileColumnProps> = ({ items, selectedId, onSelect }) => {
    return (
        <ScrollArea.Root className="h-full w-64 border-r border-primary flex-shrink-0">
            <ScrollArea.Viewport className="h-full w-full rounded-lg p-1">
                <RadioGroup.Root
                    value={selectedId?.toString() ?? ''}
                    onValueChange={onSelect as any}
                    className="flex flex-col space-y-px"
                >
                    {items.map((item, index) => {
                        return (
                            <RadioGroup.Item
                                key={index}
                                value={index.toString()}
                                className="group relative flex select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none data-[state=checked]:bg-accent dark:data-[state=checked]:bg-accent-dark hover:bg-accent dark:hover:bg-accent-dark/50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:relative focus:z-10 focus:ring-1 focus:ring-border dark:focus:ring-border-dark"
                            >
                                <div className="flex items-center space-x-2 truncate">
                                    {item.children ? (
                                        <Folder className="w-4 h-4 text-secondary dark:text-secondary-dark flex-shrink-0" />
                                    ) : (
                                        <FileText className="w-4 h-4 text-secondary dark:text-secondary-dark flex-shrink-0" />
                                    )}
                                    <span className="truncate text-primary dark:text-primary-dark">{item.name}</span>
                                </div>
                                {item.children && (
                                    <ChevronRight className="w-4 h-4 text-secondary dark:text-secondary-dark opacity-50 group-data-[state=checked]:opacity-100 flex-shrink-0" />
                                )}
                            </RadioGroup.Item>
                        )
                    })}
                </RadioGroup.Root>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className="flex select-none touch-none p-0.5 bg-black/5 transition-colors duration-[160ms] ease-out data-[orientation=vertical]:w-2" orientation="vertical">
                <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-border dark:bg-border-dark" />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    )
}

export const FileMenu: React.FC<{ initialPath?: IMenu[]; menu: IMenu[] }> = ({ initialPath = [], menu }) => {
    const { appWindow } = useWindow()
    const router = useRouter()
    const { getItemChildren } = useFileData(menu)
    const [path, setPath] = useState<(IMenu | null)[]>([null, ...initialPath])

    useEffect(() => {
        const findPath = (items: IMenu[], targetPath: string, currentPath: IMenu[] = []): IMenu[] | null => {
            for (const item of items) {
                const newPath = [...currentPath, item]
                if (item.url?.split('?')[0] === targetPath) {
                    return newPath
                }
                if (item.children) {
                    const foundPath = findPath(item.children, targetPath, newPath)
                    if (foundPath) return foundPath
                }
            }
            return null
        }
        
        const currentPathname = appWindow?.path || ''
        const foundPath = findPath(menu, currentPathname)
        if (foundPath) {
            setPath([null, ...foundPath])
        }
    }, [menu, appWindow?.path])

    const handleSelect = useCallback(
        (columnIndex: number, item: IMenu) => {
            if (item.url && !item.children) {
                return router.push(item.url)
            }
            const newPath = path.slice(0, columnIndex + 1)
            newPath.push(item)
            setPath(newPath)
        },
        [path, router]
    )

    const columns = useMemo(() => {
        const columns: { items: IMenu[]; selectedItem: IMenu | null }[] = []
        for (let i = 0; i < path.length; i++) {
            const parentItem = path[i] 
            const items = getItemChildren(parentItem)
            const selectedItemInNextCol = i + 1 < path.length ? path[i + 1] : null 

            if (i === 0 || (parentItem && parentItem.children)) {
                columns.push({ items, selectedItem: selectedItemInNextCol })
            }
            if (parentItem && !parentItem.children) {
                break
            }
        }
        return columns
    }, [path, getItemChildren])

    const lastSelectedItem = path[path.length - 1]
    const showPreview = lastSelectedItem && !lastSelectedItem.children

    return (
        <div data-scheme="primary" className="h-72 w-full border border-primary rounded-md overflow-hidden bg-bg-light dark:bg-bg-dark">
            <div className="flex h-full">
                {columns.map((col, index) => (
                    <FileColumn
                        key={index}
                        items={col.items}
                        selectedId={col.selectedItem ? col.items.indexOf(col.selectedItem) : null}
                        onSelect={(itemId) => handleSelect(index, col.items[itemId])}
                    />
                ))}
                {showPreview && lastSelectedItem && (
                    <div className="h-full w-64 border-r border-primary flex-shrink-0 p-4">
                        <h3 className="text-lg font-semibold text-primary dark:text-primary-dark mb-2">
                            {lastSelectedItem.name}
                        </h3>
                        <p className="text-sm text-secondary dark:text-secondary-dark mb-2">
                            Type: {lastSelectedItem.children ? 'Folder' : 'File'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FileMenu