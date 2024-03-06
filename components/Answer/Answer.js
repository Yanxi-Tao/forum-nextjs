export class Answer {
  answer_id
  author_id
  author_username
  question_id
  question
  content
  preview
  comment_count
  comments
  vote_count
  favourite_count
  bookmark_count
  time_created
  time_modifed

  constructor(
    answer_id,
    author_id,
    author_username,
    question_id,
    question,
    content,
    preview,
    comment_count,
    comments,
    vote_count,
    favourite_count,
    bookmark_count,
    time_created,
    time_modifed
  ) {
    this.answer_id = answer_id
    this.author_id = author_id
    this.author_username = author_username
    this.question_id = question_id
    this.question = question
    this.content = content
    this.preview = preview
    this.comment_count = comment_count
    this.comments = comments
    this.vote_count = vote_count
    this.favourite_count = favourite_count
    this.bookmark_count = bookmark_count
    this.time_created = time_created
    this.time_modifed = time_modifed
  }
}
