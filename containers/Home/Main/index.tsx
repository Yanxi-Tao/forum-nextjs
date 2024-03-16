import * as React from 'react'

import Feed from '@/components/Feed'
import { dummy_data } from '@/data'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Main(): JSX.Element {
  return (
    <ScrollArea className="basis-[82%] h-[calc(100vh-56px)]">
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
