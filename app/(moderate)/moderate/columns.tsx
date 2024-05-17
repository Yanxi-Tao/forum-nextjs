'use client'

import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { fetchReport } from '@/actions/report/fetch-report'
import { DELETED_USER, reportOptions } from '@/lib/constants'
import { Separator } from '@/components/ui/separator'
import { AvatarCard } from '@/components/card/avatar-card'
import { deletePost } from '@/actions/post/delete-post'
import { PostType } from '@prisma/client'
import { deleteUser } from '@/actions/user/delete-user'
import { deleteCommunity } from '@/actions/community/delete-community'
import { deleteComment } from '@/actions/comment/delete-comment'
import { deleteReport } from '@/actions/report/delete-report'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Report = Awaited<ReturnType<typeof fetchReport>>[number]
const columnHelper = createColumnHelper<Report>()

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ cell }) => cell.getValue(),
  },
  {
    accessorKey: 'reportedBy.name',
    header: 'Reported By',
    cell: ({ cell }) => (
      <Link
        href={`/profile/${cell.row.original.reportedBy.slug}`}
        className="link"
      >
        {cell.getValue() as string}
      </Link>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ cell }) => new Date(cell.getValue() as string).toDateString(),
  },
  {
    id: 'specifics',
    header: 'Specifics',
    cell: ({ row }) => {
      const report = row.original
      return (
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent className="w-fit min-w-[400px] h-screen overflow-y-auto pt-9 space-y-5">
            <SheetHeader>
              <SheetTitle>Report Specifics</SheetTitle>
              <SheetDescription>
                <Link
                  href={`/profile/${report.reportedBy.slug}`}
                  className="link"
                >
                  {report.reportedBy.name}
                </Link>
                {` reported this on ${new Date(
                  report.createdAt
                ).toTimeString()}`}
              </SheetDescription>
              <SheetTitle>Reasons</SheetTitle>
              <ol className="list-decimal list-outside">
                {reportOptions.map(
                  (item) =>
                    report.reason.includes(item.id) && (
                      <li key={item.id} className="ml-6">
                        {item.label}
                      </li>
                    )
                )}
              </ol>
            </SheetHeader>
            <Separator />
            {(report.post || report.comment) && (
              <>
                <SheetTitle>Author</SheetTitle>
                {report.post?.author ? (
                  <Link
                    href={`/profile/${report.post.author.slug}`}
                    className="flex items-center space-x-2"
                  >
                    <AvatarCard
                      source={report.post.author.image}
                      name={report.post.author.name}
                      className="w-7 h-7 text-sm"
                    />
                    <span className="text-primary underline-offset-4 hover:underline">
                      {`u/${report.post.author.name}`}
                    </span>
                  </Link>
                ) : report.comment?.author ? (
                  <Link
                    href={`/profile/${report.comment.author.slug}`}
                    className="flex items-center space-x-2"
                  >
                    <AvatarCard
                      source={report.comment.author.image}
                      name={report.comment.author.name}
                      className="w-7 h-7 text-sm"
                    />
                    <span className="text-primary underline-offset-4 hover:underline">
                      {`u/${report.comment.author.name}`}
                    </span>
                  </Link>
                ) : (
                  <>
                    <AvatarCard
                      source={null}
                      name={DELETED_USER}
                      isDeleted
                      className="w-7 h-7 text-sm"
                    />
                    <span>{DELETED_USER}</span>
                  </>
                )}
              </>
            )}
            {report.post && (
              <>
                <SheetTitle>Content</SheetTitle>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    {report.post.title}
                  </h3>
                  <div
                    className="w-[800px] break-words editor"
                    dangerouslySetInnerHTML={{ __html: report.post.content }}
                  />
                </div>
              </>
            )}
            {report.comment && (
              <>
                <SheetTitle>Content</SheetTitle>
                <div className="space-y-3">{report.comment.content}</div>
              </>
            )}
            {report.user && (
              <div className="space-y-3">
                <Link
                  href={`/profile/${report.user.slug}`}
                  className="flex items-center space-x-2"
                >
                  <span>{`User: `}</span>
                  <AvatarCard
                    source={report.user.image}
                    name={report.user.name}
                    className="w-7 h-7 text-sm"
                  />
                  <span className="text-primary underline-offset-4 hover:underline">
                    {`u/${report.user.name}`}
                  </span>
                </Link>
                <div>Bio: {report.user.profile?.bio}</div>
              </div>
            )}
            {report.community && (
              <div className="space-y-3">
                <Link
                  href={`/community/${report.community.slug}`}
                  className="flex items-center space-x-2"
                >
                  <span>{`Community: `}</span>
                  <AvatarCard
                    source={null}
                    name={report.community.name}
                    className="w-7 h-7 text-sm"
                  />
                  <span className="text-primary underline-offset-4 hover:underline">
                    {`c/${report.community.name}`}
                  </span>
                </Link>
                <div>Community Description: {report.community.description}</div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const report = row.original
      const id = (report.postId ||
        report.commentId ||
        report.userId ||
        report.community?.id) as string

      const handleDelete = async () => {
        switch (report.type) {
          case 'post':
            await deletePost(id, PostType.question) // random default
            break
          case 'comment':
            deleteComment(id)
            break
          case 'user':
            await deleteUser(id)
            break
          case 'community':
            await deleteCommunity(id)
            break
          default:
            break
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => handleDelete()}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => deleteReport(report.id)}>
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
