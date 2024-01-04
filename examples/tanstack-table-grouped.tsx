import * as React from 'react'
import { getCoreRowModel, ColumnDef, useReactTable } from '@tanstack/react-table'
import { FillerRowProps } from '../src'
import { ScrollSeekPlaceholderProps } from '../dist'
import { flexRender } from '@tanstack/react-table'
import { forwardRef } from 'react'
import { groupBy } from 'lodash'
import { faker } from '@faker-js/faker'
import { TableVirtuosoGroups } from '../src/TableVirtuoso'

const generated: never[] = []

function user(index = 0) {
  let firstName = faker.name.firstName()
  let lastName = faker.name.lastName()

  return {
    index: index,
    name: `${firstName} ${lastName}`,
    jobTitle: faker.name.jobTitle(),
  }
}
const userSorter = (a, b) => {
  if (a.name < b.name) {
    return -1
  }
  if (a.name > b.name) {
    return 1
  }
  return 0
}

const getUser = (index: number) => {
  if (!generated[index]) {
    generated[index] = user(index)
  }

  return generated[index]
}

const generateData = (length: number, startIndex = 0) => {
  const users = Array.from({ length })
    .map((_, i) => getUser(i))
    .sort(userSorter)
  const groupedUsers = groupBy(users, (user) => user.name[0])
  const groupCounts = Object.values(groupedUsers).map((users) => users.length)
  const groups = Object.keys(groupedUsers)

  return { users, groupCounts, groups }
}
const { users, groups, groupCounts } = generateData(500)

export function Example() {
  const columns = React.useMemo<ColumnDef<{ id: number; content: string }>[]>(
    () => [
      {
        header: () => 'Id',
        accessorKey: 'name',
        cell: (info) => info.getValue(),
      },
      {
        header: () => 'Table item',
        accessorKey: 'jobTitle',
        cell: (info) => info.getValue(),
        footer: () => 'Footer element',
      },
    ],
    []
  )

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const { rows } = table.getRowModel()

  return (
    <>
      <TableVirtuosoGroups
        groupCounts={groupCounts}
        fixedHeaderHeight={45}
        components={{
          Table: ({ style, ...props }) => {
            return (
              <div
                {...props}
                style={{
                  ...style,
                  width: '100%',
                }}
              />
            )
          },
          TableBody: forwardRef((props, ref) => (
            <div {...props} ref={ref}>
              {props.children}
            </div>
          )),
          TableRow: (props) => {
            const index = props['data-item-index']
            const row = rows[index]!
            return (
              <div
                {...props}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    style={{
                      width: '200px',
                    }}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            )
          },
          Group: ({ style, ...props }) => {
            const index = props['data-item-index']
            return (
              <div
                {...props}
                style={{
                  ...style,
                  width: '100%',
                  color: 'white',
                  backgroundColor: 'gray',
                  top: '16px',
                }}
              >
                {index} group index
              </div>
            )
          },
          ScrollSeekPlaceholder: ({ height }: ScrollSeekPlaceholderProps) => <div style={{ height, padding: 0, border: 0 }} />,
          FillerRow: ({ height }: FillerRowProps) => <div style={{ height }} />,
          EmptyPlaceholder: () => <div>Empty</div>,
          TableHead: forwardRef((props, _) => (
            <div
              style={{
                top: '0px',
                position: 'sticky',
                zIndex: 1,
                backgroundColor: 'white',
                height: 45,
              }}
            >
              {props.children}
            </div>
          )),
        }}
        style={{ height: 400 }}
        fixedHeaderContent={() => {
          return table.getHeaderGroups().map((headerGroup) => (
            <div
              key={headerGroup.id}
              style={{
                display: 'flex',
                gap: '16px',
              }}
            >
              {headerGroup.headers.map((header) => {
                return (
                  <div
                    key={header.id}
                    style={{
                      width: '200px',
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                )
              })}
            </div>
          ))
        }}
      />
    </>
  )
}
