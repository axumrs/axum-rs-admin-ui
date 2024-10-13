export default function use$subject() {
  const { $get } = use$fetch();

  const $subjectList = ref<Subject[]>([]);
  const $subjectListPm = ref<PaginationMeta>();
  const _subjectList = async () => {
    await $get<Pagination<Subject>>("/admin/subject", (v) => {
      if (v) {
        $subjectListPm.value = {
          page: v.page,
          total_page: v.total_page,
          page_size: v.page_size,
          total: v.total,
        };
        $subjectList.value = v.data || [];
      }
    });
  };

  _subjectList().then();

  return { $subjectList, $subjectListPm };
}
