export const expected1 = `Author: Test2`;

export const wiki1 = `    <div class="author">
      Author: 
      <<if _author_href is undefined>>
        _author
      <<else>>
        <a @href="_author_href">_author</a>
      <</if>>
    </div>`;

export const variables1 = {
  variables: {},
  temporary: {
    '_author': 'Test2',
    '_author_href': undefined,
  },
};
