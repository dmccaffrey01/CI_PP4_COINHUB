from django.test.runner import DiscoverRunner


class CustomTestRunner(DiscoverRunner):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.test_db_alias = 'test'  # Specify the database alias for testing

    def setup_databases(self, **kwargs):
        return self.test_db_alias, True

    def teardown_databases(self, old_config, **kwargs):
        pass