'use client'
import * as React from 'react'

import { z } from 'zod'
import { ScrollArea } from '@/components/ui/scroll-area'
import Feed from '@/components/cards/Feed'
import { dummy_data } from '@/data'

export default function Page(): JSX.Element {
  return (
    <ScrollArea className="h-full">
      <div className="px-10">
        <Feed
          title={'Test Pjbnrgekjbnkbnn'}
          description={'Yanyu Chen'}
          titleURL={'test'}
          content={dummy_data}
          preview={
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi, dolorem. Alias sapiente, atque illum saepe quibusdam libero odit nobis expedita accusamus corrwergretgretgtergbr3gbereklblrkegbnlkrbnl...'
          }
          isAuthor={false}
        />
        <Feed
          title={'Test Test Pjbnrgekjbnkbnn'}
          description={'Yanyu Chen'}
          titleURL={'test'}
          content={dummy_data}
          preview={
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi, dolorem. Alias sapiente, atque illum saepe quibusdam libero odit nobis expedita accusamus corrwergretgretgtergbr3gbereklblrkegbnlkrbnl...'
          }
          isAuthor={false}
        />
        <Feed
          title={'Test Test Pjbnrgekjbnkbnn'}
          description={'Yanyu Chen'}
          titleURL={'test'}
          content={dummy_data}
          preview={
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi, dolorem. Alias sapiente, atque illum saepe quibusdam libero odit nobis expedita accusamus corrwergretgretgtergbr3gbereklblrkegbnlkrbnl...'
          }
          isAuthor={false}
        />
        <Feed
          title={'Test Test Pjbnrgekjbnkbnn'}
          description={'Yanyu Chen'}
          titleURL={'test'}
          content={dummy_data}
          preview={
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi, dolorem. Alias sapiente, atque illum saepe quibusdam libero odit nobis expedita accusamus corrwergretgretgtergbr3gbereklblrkegbnlkrbnl...'
          }
          isAuthor={false}
        />
        <Feed
          title={
            'Test Postwregkjnrejknbjtnjkrbnetkgjnbejrtnbrkjgnbregjkbngrejkbngrekjbnrgekjbnkbnn'
          }
          description={'Yanyu Chen'}
          titleURL={'test'}
          content={dummy_data}
          preview={
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi, dolorem. Alias sapiente, atque illum saepe quibusdam libero odit nobis expedita accusamus corrwergretgretgtergbr3gbereklblrkegbnlkrbnl...'
          }
          isAuthor={false}
        />
        <Feed
          title={
            'Test Postwregkjnrejknbjtnjkrbnetkgjnbejrtnbrkjgnbregjkbngrejkbngrekjbnrgekjbnkbnn'
          }
          description={'Yanyu Chen'}
          titleURL={'test'}
          content={dummy_data}
          preview={
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi, dolorem. Alias sapiente, atque illum saepe quibusdam libero odit nobis expedita accusamus corrwergretgretgtergbr3gbereklblrkegbnlkrbnl...'
          }
          isAuthor={false}
        />
      </div>
    </ScrollArea>
  )
}
