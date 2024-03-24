import { faker } from '@faker-js/faker'
import { CommunityCardProps, FeedCardProps } from '@/lib/types'
import { PostType } from '@prisma/client'

export function communityTestData(): CommunityCardProps {
  return {
    id: faker.string.uuid(),
    name: faker.lorem.words(),
    slug: faker.lorem.slug(),
    description: faker.lorem.paragraph(5),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    postsCount: faker.number.int(1000000),
    membersCount: faker.number.int(10000000),
  }
}

export function feedCardTestData(): FeedCardProps {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.words(),
    content: faker.lorem.paragraph(),
    authorName: faker.person.fullName(),
    authorSlug: faker.lorem.slug(),
    communitySlug: faker.lorem.slug(),
    communityName: faker.lorem.words(),
    commentsCount: faker.number.int(1000000),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    preview: faker.lorem.paragraph(6),
    slug: faker.lorem.slug(),
    type: faker.helpers.enumValue(PostType),
    questionId: faker.string.uuid(),
    authorId: faker.string.uuid(),
    communityId: faker.string.uuid(),
    views: faker.number.int(1000000),
    votes: faker.number.int(1000000),
    bookmarks: faker.number.int(1000000),
  }
}
