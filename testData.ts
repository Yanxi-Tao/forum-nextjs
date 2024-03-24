import { faker } from '@faker-js/faker'
import { CommunityCardProps, FeedCardProps } from '@/lib/types'
import { PostType } from '@prisma/client'

export function communityTestData(): CommunityCardProps {
  return {
    id: faker.string.uuid(),
    name: faker.lorem.words(),
    slug: faker.lorem.slug(),
    description: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    postsCount: faker.number.int(),
    membersCount: faker.number.int(),
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
    commentsCount: faker.number.int(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
    preview: faker.lorem.sentence(),
    slug: faker.lorem.slug(),
    type: faker.helpers.enumValue(PostType),
    questionId: faker.string.uuid(),
    authorId: faker.string.uuid(),
    communityId: faker.string.uuid(),
    views: faker.number.int(),
    votes: faker.number.int(),
    bookmarks: faker.number.int(),
  }
}
