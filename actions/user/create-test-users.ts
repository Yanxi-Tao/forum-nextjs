'use server'

import { db } from '@/db/client'
import { slugify } from '@/lib/slug'
import bcrypt from 'bcryptjs'

const testUsers = [
  {
    name: 'Ruhaan Bhardwaj',
    email: 'ruhaan_bhardwaj@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Darius Calistru',
    email: 'darius_calistru@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Christophe Cannon',
    email: 'christophe_cannon@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Thomas Chen',
    email: 'langchuan_chen@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Kefei Cheng',
    email: 'kefei_cheng@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Gustav Conrad',
    email: 'gustav_conrad@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Finn Cuming',
    email: 'finnegan_cuming@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Charlie Fields',
    email: 'charlie_fields@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Hanano Hayakawa',
    email: 'hanano_hayakawa@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Ben Hofmann',
    email: 'ben_hofmann@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Minjune Jung',
    email: 'minjune_jung@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Selia Kharabanda',
    email: 'selia_kharabanda@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Diya Komali',
    email: 'diya_komali@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Rachel Lee',
    email: 'rachel_lee@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Max Lumley',
    email: 'max_lumley@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Jesse Olbrechts',
    email: 'jesse_olbrechts@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Yao Qin',
    email: 'yao_qin@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Jonah Rothenberger',
    email: 'jonah_rothenberger@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Simon Schmidt',
    email: 'simon_schmidt@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Rose Valli',
    email: 'rose_valli@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Malakai Waters',
    email: 'malakai_waters@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Zoe Zhang',
    email: 'ziyou_zhang@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
  {
    name: 'Hendrik Zihla',
    email: 'hendrik_zihla@fis.edu',
    password: 'test',
    emailVerified: new Date(),
  },
]

export const createTestUsers = async () => {
  for (const user of testUsers) {
    user.password = await bcrypt.hash(user.password, 10)
    await db.user.create({
      data: {
        ...user,
        profile: {
          create: {
            bio: '',
          },
        },
        slug: slugify(user.name),
      },
    })
  }
}
